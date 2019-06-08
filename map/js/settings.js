/*jslint browser: true*/
/*global $,L*/
//-----------------------------------------------------------------------
var loggedIn = false;

function register(userProfile, uploadTokenOnly) {
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
		if (uploadTokenOnly) {
			setResultMessage('Upload-Token angefordert, bitte schaue in Deine Email');
		} else {
    	setResultMessage('Registrierung erfolgreich');
		}
	});

	request.fail(function (jqXHR, textStatus, errorThrown) {
   	setResultMessage('Fehler: ' + textStatus + ', ' + errorThrown);
	});

}

function onRequestUploadToken() {
	"use strict";

	var userProfile = getUserProfileForm();
	if (!userProfile.email || userProfile.email.length == 0) {
		setResultMessage('Bitte Email angeben, um einen neune Upload-Token zu bekommen.');
		return false;
	}

	register(userProfile, true);
	return false;
}

function onLogin() {
	"use strict";

	var userProfile = getUserProfileForm();
	if (!userProfile.email || userProfile.email.length == 0
		|| !userProfile.uploadToken || userProfile.uploadToken.length == 0) {
		setResultMessage('Bitte Email und Upload-Token zum Login angeben');
		return false;
	}
	login(userProfile);
	return false;
}

function login(userProfile, quiet) {
	"use strict";

	if (!userProfile.email || userProfile.email.length == 0
		|| !userProfile.uploadToken || userProfile.uploadToken.length == 0) {
		console.log("Not logged on");
		return;
	}

	var request = $.ajax({
			url: getAPIURI() + "/myProfile",
      contentType: "application/json; charset=utf-8",
			type: "GET",
			dataType: "json",
      processData: true,
			headers: {"Upload-Token":userProfile.uploadToken,
					"Email": userProfile.email
			},
      data: JSON.stringify(userProfile)
    });

  request.done(function (data) {
    loggedIn = true;
		data.uploadToken = userProfile.uploadToken;
		data.cc0 = data.license.startsWith("CC0");
		setUserProfile(data);
		setUserProfileForm(data);
		if (!quiet) {
			setResultMessage('Login erfolgreich.');
		}
	});

	request.fail(function (jqXHR, textStatus, errorThrown) {
		badUploadToken(userProfile);
	});
}

function badUploadToken(userProfile) {
	"use strict";

	loggedIn = false;
	userProfile.uploadToken = "";
	setUserProfile(userProfile);
	setUserProfileForm(userProfile);
	setResultMessage('Upload-Token ungültig, bitte einen Neuen anfordern');
}

function togglePoints() {
	"use strict";

	$("#togglePoints").toggleClass("fa-toggle-on").toggleClass("fa-toggle-off");
  var showPoints = $("#togglePoints").hasClass("fa-toggle-on");
	localStorage.setItem("showPoints", showPoints ? "true" : "false");
}

function getUserProfileForm() {
	"use strict";

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

	return userProfile;
}

function uploadProfile(userProfile) {
	"use strict";

	var request = $.ajax({
			url: getAPIURI() + "/myProfile",
      contentType: "application/json; charset=utf-8",
			type: "POST",
			data: JSON.stringify(userProfile),
			dataType: "text",
      processData: false,
			headers: {"Upload-Token":userProfile.uploadToken,
					"Email": userProfile.email
			},
      data: JSON.stringify(userProfile)
    });

  request.done(function (data) {
    loggedIn = true;
		setResultMessage('Profil gespeichert');
	});

	request.fail(function (jqXHR, textStatus, errorThrown) {
		var status = jqXHR.status;
		if (status == 400) {
			setResultMessage('Ungültige Daten: ' + textStatus + ', ' + errorThrown);
		} else if (status == 401) {
			setResultMessage('Ungültige Token, bitte einen Neuen anfordern');
			badUploadToken(userProfile);
		} else if (status == 409) {
			setResultMessage('Profile kann nicht gespeichert werden, es liegt ein Konflikt mit einem anderen Nickname oder einer Email vor.');
		} else {
			setResultMessage('Speichern fehlgeschlagen: ' + textStatus + ', ' + errorThrown);
		}
	});

}

function saveProfile() {
	"use strict";

  var userProfile = getUserProfileForm();
  setUserProfile(userProfile);
  if (userProfile.uploadToken === undefined || userProfile.uploadToken.length == 0) {
  	register(userProfile);
  } else {
		if (loggedIn) {
			uploadProfile(userProfile);
		} else {
    	setResultMessage('Benutzerprofil gespeichert');
		}
  }

  return true;
}

function setUserProfileForm(userProfile) {
	"use strict";

	$("#profileNickname").val(userProfile.nickname);
  $("#profileEmail").val(userProfile.email);
  $("#profileUploadToken").val(userProfile.uploadToken);
  $("#profilePhotoOwner").prop('checked',(userProfile.photoOwner || userProfile.photoOwner === "true"));
  $("#profileAnonymous").prop('checked',(userProfile.anonymous || userProfile.anonymous === "true"));
  $("#profileLink").val(userProfile.link);
  $("#profileCc0").prop('checked',(userProfile.cc0 || userProfile.cc0 === "true"));

	if (loggedIn) {
		$("#saveProfile").html("Speichern");
	} else {
		$("#saveProfile").html("Registrieren");
	}
}

$(document).ready(function () {
	"use strict";

  var userProfile = getUserProfile();
	setUserProfileForm(userProfile);

  var showPoints = getBoolFromLocalStorage("showPoints", false);
  if (showPoints) {
    $("#togglePoints").toggleClass("fa-toggle-on");
  } else {
    $("#togglePoints").toggleClass("fa-toggle-off");
  }

	login(userProfile, true);

});
