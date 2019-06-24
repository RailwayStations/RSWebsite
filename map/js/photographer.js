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
					var detailLink = "station.php?countryCode=" + obj[i].country + "&stationId=" + obj[i].idStr;
					$("#stations").append("<div class=\"station\">" +
						"<h1><a href=\"" + detailLink + "\" data-ajax=\"false\">" + obj[i].title + "</a></h1>" +
						"<div><a href=\"" + detailLink + "\" data-ajax=\"false\" style=\"display: block; max-height: 200px; overflow: hidden;\"><img src=\"" + photoURL + "\" style=\"width:301px;\" height=\"400\"></a></div>" +
						"<div>Lizenz: <a href=\"" + obj[i].licenseUrl + "\">" + obj[i].license + "</a></div>" +
						"</div>");
				}
			} else {
				$("#stations").html("Keine Bahnhöfe gefunden");
			}
		}
	});

});
