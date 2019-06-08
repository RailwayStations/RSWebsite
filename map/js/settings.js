/*jslint browser: true*/
/*global $,L*/
//-----------------------------------------------------------------------

function register(userProfile) {
	"use strict";

  console.log(JSON.stringify(userProfile));

	var request = $.ajax({
			url: getAPIURI() + "/registration",
      contentType: "application/json; charset=utf-8",
			type: "POST",
			dataType: "text",
      processData: false,
      data: JSON.stringify(userProfile)
    });

  request.done(function (data) {
    setResultMessage('Registrierung erfolgreich');
			});

	request.fail(function (jqXHR, textStatus, errorThrown) {
    setResultMessage('Registrierung fehlgeschlagen: ' + textStatus + ', ' + errorThrown);
			});

}

function togglePoints() {
	"use strict";

	$("#togglePoints").toggleClass("fa-toggle-on").toggleClass("fa-toggle-off");
  var showPoints = $("#togglePoints").hasClass("fa-toggle-on");
	localStorage.setItem("showPoints", showPoints ? "true" : "false");
}

function saveProfile() {
  var userProfile = getUserProfile();
  userProfile.nickname = $("#profileNickname").val();
  userProfile.email = $("#profileEmail").val();
  userProfile.uploadToken = $("#profileUploadToken").val();
  userProfile.photoOwner = $("#profilePhotoOwner").is(':checked');
  userProfile.anonymous = $("#profileAnonymous").is(':checked');
  userProfile.link = $("#profileLink").val();
  userProfile.cc0 = $("#profileCc0").is(':checked');
  if (userProfile.cc0) {
    userProfile.license = "CC0";
  } else {
    userProfile.license = "";
  }
  setUserProfile(userProfile);
  if (userProfile.uploadToken === undefined || userProfile.uploadToken.length == 0) {
    register(userProfile);
  } else {
    setResultMessage('Benutzerprofil gespeichert');
  }

  return true;
}

$(document).ready(function () {
	"use strict";
  var userProfile = getUserProfile();

  $("#profileNickname").val(userProfile.nickname);
  $("#profileEmail").val(userProfile.email);
  $("#profileUploadToken").val(userProfile.uploadToken);
  if (userProfile.photoOwner || userProfile.photoOwner === "true") {
    $("#profilePhotoOwner").attr('checked','checked');
  }
  if (userProfile.anonymous || userProfile.anonymous === "true") {
    $("#profileAnonymous").attr('checked','checked');
  }
  $("#profileLink").val(userProfile.link);
  if (userProfile.cc0 || userProfile.cc0 === "true") {
    $("#profileCc0").attr('checked','checked');
  }

  var showPoints = getBoolFromLocalStorage("showPoints", false);
  if (showPoints) {
    $("#togglePoints").toggleClass("fa-toggle-on");
  } else {
    $("#togglePoints").toggleClass("fa-toggle-off");
  }

});
