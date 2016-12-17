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
				red += markers[i].options.icon.options.iconUrl.indexOf('train') > 0 ? 1 : 0;
				blue += markers[i].options.icon.options.iconUrl.indexOf('photo') > 0 ? 1 : 0;
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
			iconUrl: './images/pointer-' + (dataBahnhoefe[i].photographer === null ? 'train' : 'photo') + '.png',
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

/*function showMarkerImages() {
	'use strict';

	if (markers) {
		map.removeLayer(markers);
	}
	markers = L.markerClusterGroup();

    var pois1 = new OpenLayers.Layer.Text( "mit Foto",
                    { location:"./fertig.txt",
                      projection: map.displayProjection
                    });
    map.addLayer(pois1);
    var pois2 = new OpenLayers.Layer.Text( "ohne Foto",
	                    { location:"./offen.txt",
	                      projection: map.displayProjection
	                    });
    map.addLayer(pois2);
 // create layer switcher widget in top right corner of map.
    var layer_switcher= new OpenLayers.Control.LayerSwitcher({});
    map.addControl(layer_switcher);
    //Set start centrepoint and zoom
    var lonLat = new OpenLayers.LonLat( 10.34454, 51.76577 )
          .transform(
            new OpenLayers.Projection("EPSG:4326"), // transform from WGS 1984
            map.getProjectionObject() // to Spherical Mercator Projection
          );
    var zoom=6;
    map.setCenter (lonLat, zoom);

}*/

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
		showMarkerImagesClustered();
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
