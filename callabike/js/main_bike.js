$( document ).ready(function() {

  var basemap = L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { maxZoom: 18,
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' }
    );

 var map = L.map('map').setView([50.9730622,10.9603269], 6);
  basemap.addTo(map);
  
 
  var customIcon = L.icon({
        iconUrl: './images/bike.png',
        iconSize: [50, 50],
        iconAnchor: [25, 50],
        popupAnchor: [0, -28]
    });

 var markers = L.markerClusterGroup();
 map.spin(true);
 
 $.getJSON('bikes.geojson', function(featureCollection) {
    var bahnhoefe = L.geoJson(featureCollection, {
      pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: customIcon});
      },
      onEachFeature: function (feature, layer) {
        
        layer.bindPopup('Haltestellen ID: ' + feature.properties.HaltestellenID + '<br/>' + 'Stadt: ' + feature.properties.Stadt);
      }  
    })
  markers.addLayer(bahnhoefe); // add it to the cluster group
	map.addLayer(markers);		// add it to the map
	map.fitBounds(markers.getBounds()); //set view on the cluster extend
  })
  

  .done(function() {
    // alert( "second success" );
    map.spin(false);
  })
  .fail(function(xhr) {
    alert( "error" );
    map.spin(false);
  })
  .always(function() {
    // alert( "finished" );
  });

});