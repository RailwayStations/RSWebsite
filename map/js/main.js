/*jslint browser: true*/
/*global $,L*/

//-----------------------------------------------------------------------

var dataBahnhoefe = null,
	map = null,
	markers = null,
	popup = null,
	countries = null,
	nickname;

function setCountryCode(countryCode) {
	"use strict";

	localStorage.setItem("countryCode", countryCode);
}

function getCountryCode() {
	"use strict";

	var countryCode = localStorage.getItem("countryCode");
	if (countryCode == null) {
		countryCode = "de";
	}

	return countryCode;
}

function getAPIURI() {
	"use strict";

	return "https://api.railway-stations.org/";
}

function showMap() {
	"use strict";

	$("#karte").show();
	$("#details").hide();
}

/**
 * Uses the Google Image Proxy to return a scaled version of the image
 *
 * @param {string} src The URL to the original image
 * @param {number} width
 * @return {string} The URL to the scaled image
 */
function scaleImage(src, width) {
	return "https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&resize_w=" + width + "&url=" + encodeURIComponent(src);
}

function showPopup(feature, layer) {
	"use strict";

	var detailLink = "station.html?countryCode=" + feature.properties.country + "&stationId=" + feature.properties.id;
	var str = "";
	if (null !== feature.properties.photographer) {
		var photoURL = scaleImage(feature.properties.photoUrl, 301);
		str += "<a href=\"" + detailLink + "\" class=\"localLink\" style=\"display: block; max-height: 200px; overflow: hidden;\"><img src=\"" + photoURL + "\" style=\"width:301px;\" height=\"400\"></a><br>";
		str += "<div style=\"text-align:right;\">Fotograf: <a href=\"" + feature.properties.photographerUrl + "\">" + feature.properties.photographer + "</a>, Lizenz: " + feature.properties.license + "</div>";
		str += "<h1 style=\"text-align:center;\"><a href=\"" + detailLink + "\" class=\"localLink\">" + feature.properties.title + "</a></h1>";
	} else {
		str += "<a href=\"" + detailLink + "\" class=\"localLink\"><h1 style=\"text-align:center;\">" + feature.properties.title + "</h1></a>";
		str += "<div>Hier fehlt noch ein Foto.</div>";
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
	menu += "<li><a href=\"javascript:showSettings();\" title=\"Einstellungen\"><i class=\"fa fa-sliders\" aria-hidden=\"true\" style=\"font-size:2em;\"></i></a></li>";
	menu += "<li><a href=\"javascript:showHighScore();\" title=\"Rangliste\"><i class=\"fa fa-line-chart\" aria-hidden=\"true\" style=\"font-size:2em;\"></i></a></li>";
	menu += "<li><a href=\"https://chat.railway-stations.org\" title=\"Chat\" target=\"_blank\"><i class=\"fa fa-comments\" aria-hidden=\"true\" style=\"font-size:2em;\"></i></a></li>";
	menu += "<li><a href=\"faq.html\" title=\"FAQ\" class=\"localLink\"><i class=\"fa fa-question\" aria-hidden=\"true\" style=\"font-size:2em;\"></i></a></li>";
	menu += "<li><a href=\"https://github.com/RailwayStations\" title=\"Entwicklung\"><i class=\"fa fa-github\" aria-hidden=\"true\" style=\"font-size:2em;\"></i></a></li>";
	menu += "<li><a href=\"impressum.html\" class=\"localLink\">Impressum</a></li>";

	$("#top.header .nav-menu").html(menu);
	preventLocalLink();
}

function preventLocalLink() {
	"use strict";

	$(".localLink").click(function(e) {
		e.preventDefault();
		window.location.href = $(this).attr("href");
	});
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

function clickPoints() {
	"use strict";

	var showPoints;

	showPoints = !$("#togglePoints").hasClass("fa-toggle-on");
	$("#togglePoints").toggleClass("fa-toggle-on").toggleClass("fa-toggle-off");
	localStorage.setItem("showPoints", showPoints ? "true" : "false");

	updateMarker(showPoints);
}

function getStationsURL() {
	"use strict";

  return getAPIURI() + getCountryCode() + "/stations";
}

function setNickname() {
	"use strict";

	var showPoints;

	nickname = $("#nickname").val();
	localStorage.setItem("nickname", nickname);

	showPoints = $("#togglePoints").hasClass("fa-toggle-on");

	updateMarker(showPoints);
}

function switchCountry() {
	"use strict";

	var showPoints, uri;

	showPoints = $("#togglePoints").hasClass("fa-toggle-on");
	setCountryCode($("#country").val());

	$("#details").hide();
	$("#karte").show();

	initLayout();

	$.getJSON(getStationsURL(), function (featureCollection) {
		dataBahnhoefe = featureCollection;

		updateMarker(showPoints);
	});
}

function showHighScore() {
	"use strict"

	$.ajax({
			url: getAPIURI() + getCountryCode() + "/photographers",
			type: "GET",
			dataType: "json",
			error: function () {
					console.log("loading highscore failed");
			},
			success: function (obj) {
					var jsonOutput = "";
					var rang = 0;
					var lastPhotoCount = -1;
					var countPhotographers = 0;
					var countPhotos = 0;
					$.each(obj, function (propertyName, valueOfProperty) {
									countPhotographers++;
									countPhotos += valueOfProperty;
								  if (lastPhotoCount != valueOfProperty) {
										rang = rang + 1;
									}
									lastPhotoCount = valueOfProperty;

									var crown = "";
									if (rang == 1) {
										crown = "<img src=\"images/crown_gold.png\"/>";
									} else if (rang == 2) {
										crown = "<img src=\"images/crown_silver.png\"/>";
									} else if (rang == 3) {
										crown = "<img src=\"images/crown_bronze.png\"/>";
									} else {
										crown = rang + ".";
									}

									jsonOutput = jsonOutput + "<tr><td>" + crown + "</td><td>" + valueOfProperty + "</td><td>" + propertyName + "</td></tr>";
							});

							swal({
									title: "<h4 class=\"h4rangliste\">Rangliste</h4>",
									text: "<p>Anzahl Bahnhofsfotos: <strong>" + countPhotos + "</strong><br>" +
												"Anzahl Fotografen: <strong>" + countPhotographers + "</strong></p>" +
												"<div style=\"height:60vh;overflow-y:scroll;\"><table style=\"width:100%;\">" + jsonOutput + "</table></div>",
									confirmButtonColor: "#9f0c35",
									html: true
							});

							$(".sweet-alert").scrollTop();
					}
			});
}

function showSettings() {
	"use strict"

	var showPoints = getBoolFromLocalStorage("showPoints", false);

	swal({
			title: "<h4 class=\"h4sweetalert\">Einstellungen</h4>",
			text: "<p class=\"name\"><a href=\"#\" onclick=\"clickPoints()\"><span style=\"padding:0 1em 0 0;text-align:right;width:7em;text-decoration-line:none;\">Marker</span><i id=\"togglePoints\" class=\"fa " + (showPoints?"fa-toggle-on":"fa-toggle-off") + "\" aria-hidden=\"true\" style=\"font-size:2em;\"></i><span style=\"padding:0 0 0 1em;text-align:right;width:7em;text-decoration-line:none;\">Punkte</span></a></p>" +
						"<p class=\"name\"><input id=\"nickname\" onchange=\"setNickname()\" value=\"" + nickname + "\" style=\"display:inline-block\" placeholder=\"Nickname\"/></p>",
			confirmButtonColor: "#9f0c35",
			html: true
	});

}

function getBoolFromLocalStorage(pre, defaultVal) {
	"use strict"

	var value = localStorage.getItem(pre);

	if (value == null) {
		return defaultVal;
	}

  return localStorage.getItem(pre) == "true" ? true : false;
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

	nickname = localStorage.getItem("nickname");

	initLayout();

	$("#country").selectmenu();
	$.getJSON(getAPIURI() + "countries", function (countryData) {
		countries = countryData;
		var select = $("#country");
		for (var i = 0; i < countries.length; ++i) {
			select.append($("<option>", {
			    value: countries[i].code,
			    text: countries[i].name
			}));
		}
		select.val(getCountryCode());
	});

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
    										return matcher.test(bahnhof.title) || matcher.test(bahnhof.id);
						});
	          response( $.map(filtered, function (value, key) {
	                			return {
	                    		label: value.title,
	                    		value: value.id
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
							return bahnhof.id == ui.item.value;
			});
			map.panTo(L.latLng(bahnhof[0].lat, bahnhof[0].lon));
			map.setZoom(14);

			var bahnhofMarkers = markers.getLayers();
			if (!bahnhofMarkers[0].options) {
				bahnhofMarkers = bahnhofMarkers[0].getLayers();
			}
			for (var i in bahnhofMarkers) {
				var markerID = bahnhofMarkers[i].options.properties.id;
				if (markerID == ui.item.value) {
					showPopup(bahnhofMarkers[i].options, this);
				}
			}
			return false;
		}
	});

});
