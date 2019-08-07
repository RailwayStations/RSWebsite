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
					$("#stations").append("<div class=\"card mt-1\" style=\"max-width: 302px;\">" +
						  "<div class=\"card-body\">" +
						  "  <h5 class=\"card-title\"><a href=\"" + detailLink + "\" data-ajax=\"false\">" + obj[i].title + "</a></h5>" +
						  "  <p class=\"card-text\"><small class=\"text-muted\">Lizenz: <a href=\"" + obj[i].licenseUrl + "\">" + obj[i].license + "</a></small></p>" +
						  "</div>" +
						  "<a href=\"" + detailLink + "\" data-ajax=\"false\"><img src=\"" + photoURL + "\" class=\"card-img-top\" style=\"width:301px;\" alt=\"" + obj[i].title + "\"></a>" +
						"</div>");
				}
			} else {
				$("#stations").html("Keine Bahnhöfe gefunden");
			}
		}
	});

});
