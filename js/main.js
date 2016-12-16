$( document ).ready(function() {

  var basemap = L.tileLayer(
    'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    { maxZoom: 18,
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors, Points &copy 2012 LINZ' }
    );

//Schladen-Werla
//52.020887, 10.602324

 var map = L.map('map').setView([50.9730622,10.9603269], 6);
  basemap.addTo(map);
  
 
  var customIcon = L.icon({
        iconUrl: '../images/pointer.png',
        iconSize: [32, 46],
        iconAnchor: [16, 46],
        popupAnchor: [0, -28]
    });

 var markers = L.markerClusterGroup();
 map.spin(true);
 
 $.getJSON('bahnhoefe.geojson', function(featureCollection) {
    var bahnhoefe = L.geoJson(featureCollection, {
      pointToLayer: function (feature, latlng) {
            return L.marker(latlng, {icon: customIcon});
      },
      onEachFeature: function (feature, layer) {
        
        layer.bindPopup('<a href="detail.php?bahnhofNr=' + feature.properties.BahnhofNr + '">' + feature.properties.Station + '</a><br />Bundesland: ' + feature.properties.Bundesland );
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