/*jslint browser: true*/
/*global $,L*/

//-----------------------------------------------------------------------

$(document).ready(function () {
	"use strict";
	var vars = getQueryParameter();
	var stationId = vars.stationId;
	var countryCode = vars.countryCode;

	$.ajax({
		url: getAPIURI() + countryCode + "/stations/" + stationId,
		type: "GET",
		dataType: "json",
		error: function () {
			$("#photo-caption").html("Fehler beim Laden der Station");
		},
		success: function (obj) {
			if (obj !== null) {
				$("#station-name").html(obj.title);
				if (null !== obj.photographer) {
					$("#station-photo").attr("src", obj.photoUrl);
					$("#photographer").html(obj.photographer);
					$("#photographer-url").attr("href", obj.photographerUrl);
					$("#license").html(obj.license);
					// $("#license-url").attr("href", licenseUrl);
				} else {
					$("#photo-caption").html("Hier fehlt noch ein Foto");
				}
			} else {
				$("#photo-caption").html("Station nicht gefunden");
			}
		}
	});

});
