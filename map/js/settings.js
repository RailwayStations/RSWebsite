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
			alert('Upload-Token angefordert, bitte schaue in Deine Email');
		} else {
    	alert('Registrierung erfolgreich');
		}
	});

	request.fail(function (jqXHR, textStatus, errorThrown) {
		var status = jqXHR.status;
		if (status == 400) {
			alert('Ungültige Daten: ' + textStatus + ', ' + errorThrown);
		} else if (status == 409) {
			alert('Es liegt ein Konflikt mit einem anderen Nickname oder einer Email vor. Bitte kontaktiere unseren Support: Bahnhofsfotos@deutschlands-Bahnhoefe.de');
		} else {
			alert('Fehler: ' + textStatus + ', ' + errorThrown);
		}
	});

}

function newUploadToken(email) {
	"use strict";

	var request = $.ajax({
			url: getAPIURI() + "/newUploadToken",
      contentType: "application/json; charset=utf-8",
			type: "POST",
			dataType: "text",
      processData: false,
			headers: {
					"Email": email
			}

    });

  request.done(function (data) {
		alert('Upload-Token angefordert, bitte schaue in Deine Email');
	});

	request.fail(function (jqXHR, textStatus, errorThrown) {
		var status = jqXHR.status;
		if (status == 400) {
			alert('In Deinem Profil ist keine Email hinterlegt. Bitte kontaktiere unseren Support: Bahnhofsfotos@deutschlands-Bahnhoefe.de');
		} else if (status == 404) {
			alert('Kein Profil mit dieser Email / mit diesem Nickname gefunden.');
		} else {
			alert('Fehler: ' + textStatus + ', ' + errorThrown);
		}
	});

}

function onRequestUploadToken() {
	"use strict";

	var email = $("#loginEmail").val();

	if (isBlank(email)) {
		alert('Bitte Email oder Nickname angeben, um einen neuen Upload-Token zu bekommen.');
		return false;
	}

	newUploadToken(email);
	return false;
}

function onLogin() {
	"use strict";

	var email = $("#loginEmail").val();
  var uploadToken = $("#loginUploadToken").val();

	if (isBlank(email) || isBlank(uploadToken)) {
		alert('Bitte Email und Upload-Token zum Login angeben');
		return false;
	}
	login();
	return false;
}

function login(quiet) {
	"use strict";

  var email = $("#loginEmail").val();
  var uploadToken = $("#loginUploadToken").val();

	if (isBlank(email) || isBlank(uploadToken)) {
		console.log("Not logged on");
		return;
	}

	var request = $.ajax({
			url: getAPIURI() + "/myProfile",
      contentType: "application/json; charset=utf-8",
			type: "GET",
			dataType: "json",
      processData: true,
			headers: {"Upload-Token":uploadToken,
					"Email": email
			}
    });

  request.done(function (data) {
    loggedIn = true;
		data.uploadToken = uploadToken;
		data.cc0 = data.license.startsWith("CC0");
		setUserProfile(data);
		setUserProfileForm(data);
		$("#loginProfile").css('visibility','collapse');
		$("#fullProfile").css('visibility','visible');
		if (!quiet) {
			alert('Login erfolgreich.');
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
	$("#loginProfile").css('visibility','visible');
	$("#fullProfile").css('visibility','collapse');
	alert('Upload-Token ungültig, bitte einen Neuen anfordern');
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
			dataType: "text",
      processData: false,
			headers: {"Upload-Token":userProfile.uploadToken,
					"Email": userProfile.email
			},
      data: JSON.stringify(userProfile)
    });

  request.done(function (data) {
    loggedIn = true;
		alert('Profil gespeichert');
	});

	request.fail(function (jqXHR, textStatus, errorThrown) {
		var status = jqXHR.status;
		if (status == 400) {
			alert('Ungültige Daten: ' + textStatus + ', ' + errorThrown);
		} else if (status == 401) {
			alert('Ungültige Token, bitte einen Neuen anfordern');
			badUploadToken(userProfile);
		} else if (status == 409) {
			alert('Es liegt ein Konflikt mit einem anderen Nickname oder einer Email vor. Bitte kontaktiere unseren Support: Bahnhofsfotos@deutschlands-Bahnhoefe.de');
		} else {
			alert('Speichern fehlgeschlagen: ' + textStatus + ', ' + errorThrown);
		}
	});

}

function isURL(str) {
	try {
    var url = new URL(str);
		return (url.protocol == "http:" || url.protocol == "https:") ;
  } catch (_) {
    return false;
  }
}

function onSaveProfile() {
	"use strict";

  var userProfile = getUserProfileForm();
  setUserProfile(userProfile);

	if (!userProfile.cc0) {
		alert('Bitte akzeptiere CC0, damit wir Deine Fotos ohne Probleme verwenden können.')
		return false;
	}

	if (!userProfile.photoOwner) {
		alert('Bitte gib an, ob es sich um Deine eigenen Fotos handelt.')
		return false;
	}

	if (isBlank(userProfile.nickname)) {
		alert('Bitte gib Deinen Nickname an.')
		return false;
	}

	if (isBlank(userProfile.email)) {
		alert('Bitte gib Deine Email an.')
		return false;
	} else {
		var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
		if (!userProfile.email.match(mailformat)) {
			alert('Ungültiges Email format.')
			return false;
		}
	}

	if (isNotBlank(userProfile.link) && !isURL(userProfile.link)) {
		alert('Bitte gib eine gültige HTTP(S) URL an.')
		return false;
	}

  if (!loggedIn && isBlank(userProfile.uploadToken)) {
  	register(userProfile);
  } else {
		if (loggedIn && isNotBlank(userProfile.uploadToken)) {
			uploadProfile(userProfile);
		} else {
    	alert('Benutzerprofil gespeichert');
		}
  }

  return false;
}

function onNewRegistration() {
	"use strict";

	$("#loginProfile").css('visibility','collapse');
	$("#fullProfile").css('visibility','visible');
}

function setUserProfileForm(userProfile) {
	"use strict";

	if (isNotBlank(userProfile.email)) {
		$("#loginEmail").val(userProfile.email);
	} else {
		$("#loginEmail").val(userProfile.nickname);
	}
	$("#loginUploadToken").val(userProfile.uploadToken);

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

	login(true);

});
