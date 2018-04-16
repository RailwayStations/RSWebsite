/*jslint browser: true*/
/*global $,L*/

//-----------------------------------------------------------------------

var dataBahnhoefe = null;

$(document).ready(function () {
	'use strict';
	var vars = [];

  var q = document.URL.split('?')[1];
  if (q !== undefined) {
			q = q.split('&');

      for (var i = 0; i < q.length; i++) {
          var hash = q[i].split('=');
          vars.push(hash[1]);
          vars[hash[0]] = hash[1];
      }
  }

	var stationId = vars.stationId;
	var countryCode = vars.countryCode;

	$.ajax({
		url: 'https://api.railway-stations.org/' + countryCode + '/stations/' + stationId,
		type: 'GET',
		dataType: 'json',
		error: function () {
			$('#photo-caption').html("Fehler beim Laden der Station");
		},
		success: function (obj) {
			if (obj != undefined) {
				$('#station-name').html(obj.title);
				if (null !== obj.photographer) {
					$('#station-photo').attr('src', obj.photoUrl);
					$('#photographer').html(obj.photographer);
					$('#photographer-url').attr('href', obj.photographerUrl);
					$('#license').html(obj.license);
					// $('#license-url').attr('href', licenseUrl);
				} else {
					$('#photo-caption').html("Hier fehlt noch ein Foto");
				}
			} else {
				$('#photo-caption').html("Station nicht gefunden");
			}
		}
	});

});
