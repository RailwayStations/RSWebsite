/*jslint browser: true*/
/*global $,L*/

//-----------------------------------------------------------------------

var dataBahnhoefe = null,
	map = null,
	markers = null,
	popup = null;
	countries = null;

function setLanguage(lang) {
	'use strict';

	localStorage.setItem("gLanguage", lang);
}

function getLanguage() {
	'use strict';

	var gLanguage = localStorage.getItem("gLanguage");
	if(gLanguage == null) {
	  gLanguage = 'de';
	}

	return gLanguage;
}

function getBaseURI() {
	'use strict';

	var lang = getLanguage();
	if ('ch' === lang) {
		return 'https://schweizer-bahnhoefe.ch/';
	}

	return 'http://www.deutschlands-bahnhoefe.de/';
}

function getAPIURI() {
	'use strict';

	return 'https://api.railway-stations.org/';
}

function showPopup(feature, layer) {
	'use strict';

	var str = '';
	if (null !== feature.properties.photographer) {
		str += '<a href="' + getBaseURI() + 'detail.php?bahnhofNr=' + feature.properties.id + '"><img src="' + getBaseURI() + 'images/' + feature.properties.id + '.jpg" style="width:301px;"></a><br>';
		str += '<div style="text-align:right;">' + ('jp' === getLanguage() ? '撮影' : 'Fotograf:') + ' ' + feature.properties.photographer + '</div>';
		str += '<h1 style="text-align:center;"><a href="' + getBaseURI() + 'detail.php?bahnhofNr=' + feature.properties.id + '">' + feature.properties.title + '</a></h1>';
	} else {
		str += '<h1 style="text-align:center;">' + feature.properties.title + '</h1>';
		str += '<div>Hier fehlt noch ein Foto.</div>';
	}

	if (null === popup) {
		popup = L.popup();
	}

	popup.setLatLng([feature.properties.lat, feature.properties.lon])
		.setContent(str)
		.openOn(map);
}

function initLayout() {
	'use strict';

	var lang = getLanguage(),
		menu = '';

	if ('ch' === lang) {
		document.title = 'Schweizer Bahnhöfe';
		$('#top.header .logo').html('<h1><img src="images/logo.jpg"><a href="index.html">Schweizer<strong>Bahnh&ouml;fe</strong></a></h1>');
		$('#top.header #suche')[0].placeholder = 'Finde deinen Bahnhof';
		$('aside .info:nth-child(1) h4').html('Unterstütze uns');
		$('aside .info:nth-child(1) .name').html('Du hast eigene Bilder von einem Schweizer Bahnhof? <a href="https://schweizer-bahnhoefe.ch/faq-schweiz.php" target="_blank"><strong>Hier</strong></a> klicken für die Erklärung dazu.');
		$('aside .info:nth-child(2) h4').html('Ansichten');
		$('aside .info:nth-child(2) p:nth-child(2) span:nth-child(1)').html('Punkte');
		$('aside .info:nth-child(2) p:nth-child(2) span:nth-child(3)').html('Marker');
		$('aside .info:nth-child(2) p:nth-child(3) span:nth-child(1)').html('einfarbig');
		$('aside .info:nth-child(2) p:nth-child(3) span:nth-child(3)').html('farbig');
		$('aside .info:nth-child(3) h4').html('Feedback / Ideen');
		$('aside .info:nth-child(3) .name').html('<a href="mailto:feedback@schweizer-bahnhoefe.ch">melde dich</a>');

		menu += '<li><a href="https://martinrechsteiner.ch/category/news/bahn/" target="_blank" title="Blog">Blog</a></li>';
		menu += '<li><a href="https://twitter.com/bahnhoefeCH" target="_blank" title="Twitter">Twitter</a></li>';
		menu += '<li><a href="https://www.facebook.com/SchweizerBahnhoefe" target="_blank" title="Facebook">FB</a></li>';
		menu += '<li><a href="https://www.instagram.com/bahnhoefeCH/" target="_blank" title="Instagram"><img src="images/glyph-logo_May2016.png" style="height:24px;"></a></li>';
	} else if ('jp' === lang) {
		document.title = '日本の駅';
		$('#top.header .logo').html('<h1><img src="images/logo.jpg"><a href="index.html">日本<strong>の駅</strong></a></h1>');
		$('#top.header #suche')[0].placeholder = '駅名検索';
		$('aside .info:nth-child(1) h4').html('ご協力したい方');
		$('aside .info:nth-child(1) .name').html('駅の写真を投稿する方法については<a href="https://railway-stations.org/faq" target="_blank"><strong>こちら</strong></a>');
		$('aside .info:nth-child(2) h4').html('表示設定');
		$('aside .info:nth-child(2) p:nth-child(2) span:nth-child(1)').html('全駅表示');
		$('aside .info:nth-child(2) p:nth-child(2) span:nth-child(3)').html('まとめ表示');
		$('aside .info:nth-child(2) p:nth-child(3) span:nth-child(1)').html('駅数のみ');
		$('aside .info:nth-child(2) p:nth-child(3) span:nth-child(3)').html('完成度');
		$('aside .info:nth-child(3) h4').html('ご意見・ご提案');
		$('aside .info:nth-child(3) .name').html('<a href="mailto:kontakt@gaby-becker.de">ご意見をご教示ください。</a>');

/*
Facebook　フェースブック
DB Planet	　DB Planet
App	アプリ
iOS	iOS
Android	Android
*/
		menu += '<li><a href="https://railway-stations.org/bahnhofsfotos-suchen" target="_blank">ダウンロード</a></li>';
		menu += '<li><a href="https://twitter.com/search?q=%23bahnhofsfoto" target="_blank" title="ツイッター"><i class="fa fa-twitter" aria-hidden="true" style="font-size:2em;"></i></a></li>';
		menu += '<li><a href="https://railway-stations.org/node/22" target="_blank">本サイトについて</a></li>';
	} else {
		document.title = 'Deutschlands Bahnhöfe';
		$('#top.header .logo').html('<h1><img src="images/logo.jpg"><a href="index.html">Deutschlands<strong>Bahnh&ouml;fe</strong></a></h1>');
		$('#top.header #suche')[0].placeholder = 'Finde deinen Bahnhof';
		$('aside .info:nth-child(1) h4').html('Unterstütze uns');
		$('aside .info:nth-child(1) .name').html('Du hast eigene Bilder von einem Bahnhof? <a href="https://railway-stations.org/faq" target="_blank"><strong>Hier</strong></a> klicken für die Erklärung dazu.');
		$('aside .info:nth-child(2) h4').html('Ansichten');
		$('aside .info:nth-child(2) p:nth-child(2) span:nth-child(1)').html('Punkte');
		$('aside .info:nth-child(2) p:nth-child(2) span:nth-child(3)').html('Marker');
		$('aside .info:nth-child(2) p:nth-child(3) span:nth-child(1)').html('einfarbig');
		$('aside .info:nth-child(2) p:nth-child(3) span:nth-child(3)').html('farbig');
		$('aside .info:nth-child(3) h4').html('Feedback / Ideen');
		$('aside .info:nth-child(3) .name').html('<a href="mailto:kontakt@gaby-becker.de">melde dich</a>');

		menu += '<li><a href="https://railway-stations.org/bahnhofsfotos-suchen" target="_blank">Download</a></li>';
		menu += '<li><a href="https://twitter.com/search?q=%23bahnhofsfoto" target="_blank" title="Twitter"><i class="fa fa-twitter" aria-hidden="true" style="font-size:2em;"></i></a></li>';
		menu += '<li><a href="https://railway-stations.org/node/22" target="_blank">Impressum</a></li>';
	}

	$('#top.header .nav-menu').html(menu);
}

function showMarkerAllClustered() {
	'use strict';

	$('body').removeClass('showCluster');
	if (markers) {
		map.removeLayer(markers);
	}
	markers = L.markerClusterGroup();

	var bahnhoefe = L.featureGroup()
		.on('click', function (event) {
			showPopup(event.layer.options, this);
		}),
		i,
		customIcon = L.icon({
			iconUrl: './images/pointer.png',
			iconSize: [32, 46],
			iconAnchor: [16, 46],
			popupAnchor: [0, -28]
		}),
		marker;

	for (i = 0; i < dataBahnhoefe.length; ++i) {
		marker = L.marker([dataBahnhoefe[i].lat, dataBahnhoefe[i].lon], {icon: customIcon, properties: dataBahnhoefe[i]}).addTo(bahnhoefe);
	}

	markers.addLayer(bahnhoefe); // add it to the cluster group
	map.addLayer(markers);		// add it to the map
	map.fitBounds(markers.getBounds()); //set view on the cluster extend
}

function showMarkerImagesClustered() {
	'use strict';

	$('body').addClass('showCluster');
	if (markers) {
		map.removeLayer(markers);
	}
	markers = L.markerClusterGroup({
		iconCreateFunction: function (cluster) {
			var markers = cluster.getAllChildMarkers(),
				red = 0,
				blue = 0,
				max = markers.length,
				i;
			for (i = 0; i < max; ++i) {
				red += markers[i].options.icon.options.iconUrl.indexOf('red') > 0 ? 1 : 0;
				blue += markers[i].options.icon.options.iconUrl.indexOf('green') > 0 ? 1 : 0;
			}
			return new L.DivIcon({ html:
				'<svg width="40" height="40" class="circle"><circle r="16" cx="20" cy="20" class="pie" style="stroke-dasharray:' + parseInt(blue / max * 100, 10) + ', 1000;"/></svg>' +
				'<div>' +
				'<span>' + max + '</span>' +
				'<span>' + parseInt(blue / max * 100, 10) + '%</span>' +
				'</div>', className: 'marker-cluster marker-cluster-large', iconSize: new L.Point(40, 40) });
		}
	});

	var bahnhoefe = L.featureGroup()
		.on('click', function (event) {
			showPopup(event.layer.options, this);
		}),
		i,
		customIcon,
		marker;

	for (i = 0; i < dataBahnhoefe.length; ++i) {
		customIcon = L.icon({
			iconUrl: './images/pointer-' + (dataBahnhoefe[i].photographer === null ? 'red' : 'green') + '.png',
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

function showCircleAllClustered(colored) {
	'use strict';

	if (markers) {
		map.removeLayer(markers);
	}
	markers = L.layerGroup();

	var bahnhoefe = L.featureGroup()
		.on('click', function (event) {
			showPopup(event.layer.options, this);
		}),
		i,
		marker,
		color;

	for (i = 0; i < dataBahnhoefe.length; ++i) {
		color = (colored ? '#B70E3D' : dataBahnhoefe[i].photographer === null ? '#B70E3D' : '#3db70e');
		marker = L.circleMarker([dataBahnhoefe[i].lat, dataBahnhoefe[i].lon], {fillColor: color, fillOpacity: 1, stroke: false, properties: dataBahnhoefe[i]}).addTo(bahnhoefe);
	}

	markers.addLayer(bahnhoefe); // add it to the cluster group
	map.addLayer(markers);		// add it to the map
//	map.fitBounds(markers.getBounds()); //set view on the cluster extend
}

function updateMarker(showPoints, colored) {
	'use strict';

	if (showPoints) {
		showCircleAllClustered(colored);
	} else {
		if (colored) {
			showMarkerAllClustered();
		} else {
			showMarkerImagesClustered();
		}
	}
}

function clickPoints() {
	'use strict';

	var showPoints, colored;

	showPoints = $('#togglePoints').hasClass('fa-toggle-on');
	$('#togglePoints').toggleClass('fa-toggle-on').toggleClass('fa-toggle-off');

	colored = !$('#toggleColor').hasClass('fa-toggle-on');

	updateMarker(showPoints, colored);
}

function clickColor() {
	'use strict';

	var showPoints, colored;

	showPoints = !$('#togglePoints').hasClass('fa-toggle-on');

	colored = $('#toggleColor').hasClass('fa-toggle-on');
	$('#toggleColor').toggleClass('fa-toggle-on').toggleClass('fa-toggle-off');

	updateMarker(showPoints, colored);
}

function getStationsURL() {
	'use strict';

	if ('jp' === getLanguage()) {
		// this is a hack!!!
		return 'http://www.deutschlands-bahnhoefe.de/bahnhoefe_japan.json';
	} else {
		return getAPIURI() + getLanguage() + '/stations';
	}
}

function switchCountry() {
	'use strict';

	var showPoints, colored, uri;

	showPoints = !$('#togglePoints').hasClass('fa-toggle-on');
	colored = !$('#toggleColor').hasClass('fa-toggle-on');
	setLanguage($('#country').val());

	initLayout();

	$.getJSON(getStationsURL(), function (featureCollection) {
		dataBahnhoefe = featureCollection;

		updateMarker(showPoints, colored);
	});
}

$(document).ready(function () {
	'use strict';

	var basemap = L.tileLayer(
		'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		{
			maxZoom: 18,
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}
	),
	lang = getLanguage();
	map = L.map('map').setView([50.9730622, 10.9603269], 6);

	basemap.addTo(map);
	map.spin(true);

	initLayout();

	$('#country').selectmenu();
	$.getJSON(getAPIURI() + 'countries', function (countries) {
		var select = $('#country');
		for (var i = 0; i < countries.length; ++i) {
			select.append($('<option>', {
			    value: countries[i].code,
			    text: countries[i].name
			}));
		}
		select.val(getLanguage());
	});

	$.getJSON(getStationsURL(), function (featureCollection) {
		dataBahnhoefe = featureCollection;

		updateMarker(false, false);
	}).done(function () {
		// alert( "second success" );
		map.spin(false);
	}).fail(function (xhr) {
		alert("error");
		map.spin(false);
	}).always(function () {
		// alert( "finished" );
	});
});
