/*jslint browser: true*/
/*global $,L*/

//-----------------------------------------------------------------------

$(document).ready(function () {
	"use strict";
	var vars = getQueryParameter();
	var photographer = vars.photographer;

	$("#photographer").html(photographer).attr("href", "index.html");;

	$.ajax({
		url: getAPIURI() + "stations?photographer=" + photographer,
		type: "GET",
		dataType: "json",
		error: function () {
			$("#stations").html("Fehler beim Laden der Stationen des Fotografen " + photographer);
		},
		success: function (obj) {
			if (Array.isArray(obj) && obj.length > 0) {
				$("#photographer").attr("href", obj[0].photographerUrl);
				for (var i = 0; i < obj.length; i++) {
					var photoURL = scaleImage(obj[i].photoUrl, 301);
					var detailLink = "station.html?countryCode=" + obj[i].country + "&stationId=" + obj[i].id;
					$("#stations").append("<div class=\"station\">" +
						"<h1><a href=\"" + detailLink + "\" class=\"localLink\">" + obj[i].title + "</a></h1>" +
						"<div><a href=\"" + detailLink + "\" class=\"localLink\" style=\"display: block; max-height: 200px; overflow: hidden;\"><img src=\"" + photoURL + "\" style=\"width:301px;\" height=\"400\"></a></div>" +
						"<div>Lizenz: " + obj[i].license + "</div>" +
						"</div>");
				}
			} else {
				$("#stations").html("Keine Bahnhöfe gefunden");
			}
		}
	});

});
