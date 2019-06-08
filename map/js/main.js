/*jslint browser: true*/
/*global $,L*/

//-----------------------------------------------------------------------

var dataBahnhoefe = null,
	map = null,
	markers = null,
	popup = null,
	countries = null,
	nickname = "";

function showMap() {
	"use strict";

	$("#karte").show();
	$("#details").hide();
}

function showPopup(feature, layer) {
	"use strict";

	var detailLink = "station.php?countryCode=" + feature.properties.country + "&stationId=" + feature.properties.idStr;
	var str = "";
	if (null !== feature.properties.photographer) {
		var photoURL = scaleImage(feature.properties.photoUrl, 301);
		str += "<a href=\"" + detailLink + "\" class=\"localLink\" style=\"display: block; max-height: 200px; overflow: hidden;\"><img src=\"" + photoURL + "\" style=\"width:301px;\" height=\"400\"></a><br>";
		str += "<div style=\"text-align:right;\">Fotograf: <a href=\"" + feature.properties.photographerUrl + "\">" + feature.properties.photographer + "</a>, "
		str += "Lizenz: <a href=\"" + feature.properties.licenseUrl + "\">" + feature.properties.license + "</a></div>"
		str += "<h1 style=\"text-align:center;\"><a href=\"" + detailLink + "\" class=\"localLink\">" + feature.properties.title + "</a></h1>";
	} else {
		str += "<a href=\"" + detailLink + "\" class=\"localLink\"><h1 style=\"text-align:center;\">" + feature.properties.title + "</h1></a>";
		str += "<div>Hier fehlt noch ein Foto.</div>";
		str += "<div><a href=\"upload.html?countryCode=" + feature.properties.country + "&stationId=" + feature.properties.idStr + "&title=" + feature.properties.title + "\" title=\"Eigenes Foto hochladen\" class=\"localLink\"><i class=\"fa fa-upload\"> Lade Dein Foto hoch.</a></div>";
	}

	if (null === popup) {
		popup = L.popup();
	}

	popup.setLatLng([feature.properties.lat, feature.properties.lon])
		.setContent(str)
		.openOn(map);

	preventLocalLink();
}

function initLayout() {
	"use strict";

	document.title = "Railway Stations";
	$("#top.header #suche")[0].placeholder = "Finde deinen Bahnhof";

	var menu = "";
	menu += "<li><a href=\"settings.html\" title=\"Einstellungen\" class=\"localLink\"><i class=\"fa fa-fw fa-2x fa-sliders\" aria-hidden=\"true\"></i><span class=\"visible-xs\"> Einstellungen</span></a></li>";
	menu += "<li><a href=\"javascript:showHighScore();\" title=\"Rangliste\"><i class=\"fa fa-fw fa-2x fa-line-chart\" aria-hidden=\"true\"></i><span class=\"visible-xs\"> Rangliste</span></a></li>";
	menu += "<li><a href=\"faq.html\" title=\"FAQ\" class=\"localLink\"><i class=\"fa fa-fw fa-2x fa-question\" aria-hidden=\"true\"></i><span class=\"visible-xs\"> FAQ</span></a></li>";
	menu += "<li><a href=\"https://github.com/RailwayStations\" title=\"Entwicklung\"><i class=\"fa fa-fw fa-2x fa-github\" aria-hidden=\"true\"></i><span class=\"visible-xs\"> Entwicklung</span></a></li>";
	menu += "<li><a href=\"impressum.html\" title=\"Impressum\" class=\"localLink\"><i class=\"fa fa-fw fa-2x fa-info\" aria-hidden=\"true\"></i><span class=\"visible-xs\"> Impressum</span></a></li>";
	menu += "<li><a href=\"datenschutz.html\" title=\"Datenschutzerklärung\" class=\"localLink\"><i class=\"fa fa-fw fa-2x fa-shield\" aria-hidden=\"true\"></i><span class=\"visible-xs\"> Datenschutzerklärung</span></a></li>";

	$("#top.header .nav-menu").html(menu);
	preventLocalLink();
}

function showMarkerImagesClustered() {
	"use strict";

	$("body").addClass("showCluster");
	if (markers) {
		map.removeLayer(markers);
	}
	markers = L.markerClusterGroup({
		iconCreateFunction: function (cluster) {
			var markers = cluster.getAllChildMarkers(),
				red = 0,
				green = 0,
				max = markers.length,
				i;
			for (i = 0; i < max; ++i) {
				red += markers[i].options.icon.options.iconUrl.indexOf("red") > 0 ? 1 : 0;
				green += (markers[i].options.icon.options.iconUrl.indexOf("green") > 0 || markers[i].options.icon.options.iconUrl.indexOf("violet") > 0) ? 1 : 0;
			}
			return new L.DivIcon({ html:
				"<svg width=\"40\" height=\"40\" class=\"circle\"><circle r=\"16\" cx=\"20\" cy=\"20\" class=\"pie\" style=\"stroke-dasharray:" + parseInt(green / max * 100, 10) + ", 1000;\"/></svg>" +
				"<div>" +
				"<span>" + max + "</span>" +
				"<span>" + parseInt(green / max * 100, 10) + "%</span>" +
				"</div>", className: "marker-cluster marker-cluster-large", iconSize: new L.Point(40, 40) });
		}
	});

	var bahnhoefe = L.featureGroup()
		.on("click", function (event) {
			showPopup(event.layer.options, this);
		}),
		i,
		customIcon,
		marker;

	for (i = 0; i < dataBahnhoefe.length; ++i) {
		customIcon = L.icon({
			iconUrl: "./images/pointer-" + (dataBahnhoefe[i].photographer === null ? "red" : (dataBahnhoefe[i].photographer === nickname ? "violet" : "green")) + ".png",
			iconSize: [50, 50],
			iconAnchor: [25, 50],
			popupAnchor: [0, -28]
		});
		marker = L.marker([dataBahnhoefe[i].lat, dataBahnhoefe[i].lon], {icon: customIcon, properties: dataBahnhoefe[i]}).addTo(bahnhoefe);
	}

	markers.addLayer(bahnhoefe); // add it to the cluster group
	map.addLayer(markers);		// add it to the map
	map.fitBounds(markers.getBounds()); //set view on the cluster extend
}

function showCircleAllClustered() {
	"use strict";

	if (markers) {
		map.removeLayer(markers);
	}
	markers = L.layerGroup();

	var bahnhoefe = L.featureGroup()
		.on("click", function (event) {
			showPopup(event.layer.options, this);
		}),
		i,
		marker,
		color;

	for (i = 0; i < dataBahnhoefe.length; ++i) {
		color = (dataBahnhoefe[i].photographer === null ? "#B70E3D" : (dataBahnhoefe[i].photographer === nickname ? "#8000FF" : "#3db70e"));
		marker = L.circleMarker([dataBahnhoefe[i].lat, dataBahnhoefe[i].lon], {fillColor: color, fillOpacity: 1, stroke: false, properties: dataBahnhoefe[i]}).addTo(bahnhoefe);
	}

	markers.addLayer(bahnhoefe); // add it to the cluster group
	map.addLayer(markers);		// add it to the map
//	map.fitBounds(markers.getBounds()); //set view on the cluster extend
}

function updateMarker(showPoints) {
	"use strict";

	if (showPoints) {
		showCircleAllClustered();
	} else {
		showMarkerImagesClustered();
	}
}

function getStationsURL() {
	"use strict";

  return getAPIURI() + getCountryCode() + "/stations";
}

function switchCountryLink(countryCode) {
	"use strict";

	setCountryCode(countryCode);

	$("#details").hide();
	$("#karte").show();
	$('.header .mobile-menu:visible .ui-link').click();

	initLayout();
	initCountry();

	$.getJSON(getStationsURL(), function (featureCollection) {
		dataBahnhoefe = featureCollection;

		updateMarker(getBoolFromLocalStorage("showPoints", false));
	});
}

function switchCountry() {
	"use strict";

	switchCountryLink($("#country").val());
}

function getPhotoCount() {
	"use strict";

	var photoCount = 0;

	for (var i = 0; i < dataBahnhoefe.length; ++i) {
		if (dataBahnhoefe[i].photographer !== null) {
			photoCount++;
		}
	}

	return photoCount;
}

function showHighScore() {
	"use strict";

	var countStations = dataBahnhoefe.length;
	var countPhotographers = 0;
	var countPhotos = getPhotoCount();
	var percentPhotos = countPhotos / countStations;

	$.ajax({
			url: getAPIURI() + getCountryCode() + "/photographers",
			type: "GET",
			dataType: "json",
			error: function () {
				showHighScorePopup(countStations, countPhotos, countPhotographers, "");
			},
			success: function (obj) {
					var jsonOutput = "";
					var rang = 0;
					var lastPhotoCount = -1;

					$.each(obj, function (propertyName, valueOfProperty) {
									countPhotographers++;
								  if (lastPhotoCount !== valueOfProperty) {
										rang = rang + 1;
									}
									lastPhotoCount = valueOfProperty;

									var crown = "";
									if (rang === 1) {
										crown = "<img src=\"images/crown_gold.png\"/>";
									} else if (rang === 2) {
										crown = "<img src=\"images/crown_silver.png\"/>";
									} else if (rang === 3) {
										crown = "<img src=\"images/crown_bronze.png\"/>";
									} else {
										crown = rang + ".";
									}

									jsonOutput = jsonOutput + "<tr><td>" + crown + "</td><td>" + valueOfProperty + "</td><td><a class=\"localLink\" href=\"photographer.html?photographer=" + propertyName + "\">" + propertyName + "</a></td></tr>";
							});

							showHighScorePopup(countStations, countPhotos, countPhotographers, jsonOutput);
					}
			});
}

function showHighScorePopup(countStations, countPhotos, countPhotographers, highscoreTable) {
	"use strict";

	var percentPhotos = countPhotos / countStations;

	var highscoreDiv = document.createElement("div");
	highscoreDiv.innerHTML = "<div id=\"progressbar\"><div class=\"progress-label\"></div></div>" +
				"<p style=\"padding-top: 10px;font-weight: bold;\">" + countPhotographers + " Fotografen</p>" +
				"<div style=\"height:60vh;overflow-y:scroll;\"><table style=\"width:100%;\">" + highscoreTable + "</table></div>";

	swal({
			title: "Rangliste",
			content: highscoreDiv,
	});

	$(".sweet-alert").scrollTop();
	$( function() {
			var progressbar = $( "#progressbar" ),
				progressLabel = $( ".progress-label" );

			progressbar.progressbar({
				value: percentPhotos * 100,
			});
			progressLabel.text( countPhotos + " von " + countStations + " Fotos");
			progressbar.find(".ui-progressbar-value").css("background", "#3db70e");
			progressbar.find(".ui-progressbar-value").css("border-color", "#3db70e");
		} );
	preventLocalLink();
}

function initCountry() {
	$("#country").selectmenu();
	$.getJSON(getAPIURI() + "countries", function (countryData) {
		countries = countryData;
		var select = $("#country");
		var menu = $("#top.header .nav-menu").html();
		var style = " style=\"border-top:2px solid #9F0C35;\"";

		select.html('');
		countries.sort(function(a,b) {
			return a.name.localeCompare(b.name);
		});

		for (var i = 0; i < countries.length; ++i) {
			select.append($("<option>", {
			    value: countries[i].code,
			    text: countries[i].name
			}));
			menu += "<li class=\"visible-xs\"><a href=\"javascript:switchCountryLink('" + countries[i].code + "');\" title=\"" + countries[i].name + "\"" + style + "><i class=\"fa fa-fw fa-2x fa-globe\" aria-hidden=\"true\"></i> " + countries[i].name + "</a></li>";
			style = "";
		}
		select.val(getCountryCode());
		select.show();

		$("#top.header .nav-menu").html(menu);
	});
}

$(document).ready(function () {
	"use strict";

	var basemap = L.tileLayer(
		"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
		{
			maxZoom: 18,
			attribution: "&copy; <a href=\"https://osm.org/copyright\">OpenStreetMap</a> contributors"
		}
	),
	countryCode = getCountryCode();
	map = L.map("map").setView([50.9730622, 10.9603269], 6);

	basemap.addTo(map);
	map.spin(true);

	nickname = getUserProfile().nickname;
	initLayout();
	initCountry();

	$.getJSON(getStationsURL(), function (featureCollection) {
		dataBahnhoefe = featureCollection;

		var showPoints = getBoolFromLocalStorage("showPoints", false);

		updateMarker(showPoints);
	}).done(function () {
		// alert( "second success" );
		map.spin(false);
	}).fail(function (xhr) {
		alert("error");
		map.spin(false);
	}).always(function () {
		// alert( "finished" );
	});

	$( "#suche" ).autocomplete({
	  source: function( request, response ) {
	          var matcher = new RegExp( $.ui.autocomplete.escapeRegex( request.term ), "i" );
						var filtered = dataBahnhoefe.filter(function (bahnhof) {
    										return matcher.test(bahnhof.title) || matcher.test(bahnhof.idStr);
						});
	          response( $.map(filtered, function (value, key) {
	                			return {
	                    		label: value.title,
	                    		value: value.idStr
	                			};
	            		})
						);
	  },
		focus: function( event, ui ) {
				 $( "#suche" ).val( ui.item.label);
				 return false;
		 },
		select: function( event, ui ) {
			$("#details").hide();
			$("#karte").show();
			$( "#suche" ).val( ui.item.label);
			var bahnhof = dataBahnhoefe.filter(function (bahnhof) {
							return bahnhof.idStr == ui.item.value;
			});
			map.panTo(L.latLng(bahnhof[0].lat, bahnhof[0].lon));
			map.setZoom(14);

			var bahnhofMarkers = markers.getLayers();
			if (!bahnhofMarkers[0].options) {
				bahnhofMarkers = bahnhofMarkers[0].getLayers();
			}
			for (var i in bahnhofMarkers) {
				var markerID = bahnhofMarkers[i].options.properties.idStr;
				if (markerID == ui.item.value) {
					showPopup(bahnhofMarkers[i].options, this);
				}
			}
			return false;
		}
	});

});
