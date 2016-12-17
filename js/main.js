var dataBahnhoefe = null,
	map = null,
	markers = null;

function showPopup(feature, layer) {
	'use strict';

	layer.bindPopup('<a href="detail.php?bahnhofNr=' + feature.properties.id + '">' + feature.properties.title + '</a><br />Fotograf: ' + feature.properties.photographer);
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
		marker;

	for (i = 0; i < dataBahnhoefe.length; ++i) {
		var color = (colored ? '#B70E3D' : dataBahnhoefe[i].photographer === null ? '#B70E3D' : '#3db70e')
		marker = L.circleMarker([dataBahnhoefe[i].lat, dataBahnhoefe[i].lon], {fillColor:color, fillOpacity:1, stroke: false, properties: dataBahnhoefe[i]}).addTo(bahnhoefe);
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

	var showPoints = $('#togglePoints').hasClass('fa-toggle-on');
	$('#togglePoints').toggleClass('fa-toggle-on').toggleClass('fa-toggle-off');

	var colored = !$('#toggleColor').hasClass('fa-toggle-on');

	updateMarker(showPoints, colored);
}

function clickColor() {
	'use strict';

	var showPoints = !$('#togglePoints').hasClass('fa-toggle-on');

	var colored = $('#toggleColor').hasClass('fa-toggle-on');
	$('#toggleColor').toggleClass('fa-toggle-on').toggleClass('fa-toggle-off');

	updateMarker(showPoints, colored);
}

$(document).ready(function () {
	'use strict';

	var basemap = L.tileLayer(
		'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		{
			maxZoom: 18,
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}
	);
	map = L.map('map').setView([50.9730622, 10.9603269], 6);

	basemap.addTo(map);
	map.spin(true);

	$.getJSON('http://fotouebersicht.deutschlands-bahnhöfe.de/de/bahnhoefe', function (featureCollection) {
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
