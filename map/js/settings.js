/*jslint browser: true*/
/*global $,L*/
//-----------------------------------------------------------------------
var loggedIn = false;

function register(userProfile, passwordResetOnly) {
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

  request.done(function(data) {
    if (passwordResetOnly) {
      alert(
        "Neues Passwort angefordert, bitte schaue in Deine Email. Prüfe auch den SPAM Ordner."
      );
    } else {
      alert("Registrierung erfolgreich");
    }
  });

  request.fail(function(jqXHR, textStatus, errorThrown) {
    var status = jqXHR.status;
    if (status == 400) {
      alert("Ungültige Daten: " + textStatus + ", " + errorThrown);
    } else if (status == 409) {
      alert(
        "Es liegt ein Konflikt mit einem anderen Nickname oder einer Email vor. Bitte kontaktiere unseren Support: Bahnhofsfotos@deutschlands-Bahnhoefe.de"
      );
    } else {
      alert("Fehler: " + textStatus + ", " + errorThrown);
    }
  });
}

function resetPassword(nameOrEmail) {
  "use strict";

  var request = $.ajax({
    url: getAPIURI() + "/resetPassword",
    contentType: "application/json; charset=utf-8",
    type: "POST",
    dataType: "text",
    processData: false,
    headers: {
      NameOrEmail: nameOrEmail
    }
  });

  request.done(function(data) {
    alert(
      "Neues Passwort angefordert, bitte schaue in Deine Email und prüfe auch den SPAM Ordner."
    );
  });

  request.fail(function(jqXHR, textStatus, errorThrown) {
    var status = jqXHR.status;
    if (status == 400) {
      alert(
        "In Deinem Profil ist keine Email hinterlegt. Bitte kontaktiere unseren Support: Bahnhofsfotos@deutschlands-Bahnhoefe.de"
      );
    } else if (status == 404) {
      alert("Kein Profil mit dieser Email / mit diesem Nickname gefunden.");
    } else {
      alert("Fehler: " + textStatus + ", " + errorThrown);
    }
  });
}

function onResetPassword() {
  "use strict";

  var nameOrEmail = $("#loginEmail").val();

  if (isBlank(nameOrEmail)) {
    alert(
      "Bitte Email oder Nickname angeben, um einen neues Passwort zu bekommen."
    );
    return false;
  }

  resetPassword(nameOrEmail);
  return false;
}

function changePassword() {
	"use strict";
	var newPassword = $("#newPassword").val();
	var newPasswordRepeat = $("#newPasswordRepeat").val();

	if (newPassword === undefined || newPassword.length < 8) {
		alert(
		  "Passwort muss mindestens 8 Zeichen lang sein."
		);
		return false;
	}
	if (newPassword !== newPasswordRepeat) {
		alert(
		  "Passwörter sind unterschiedlich"
		);
		return false;
	}
	$('#changePasswordModal').modal('hide')

	var userProfile = getUserProfileForm();

	var request = $.ajax({
	  url: getAPIURI() + "/changePassword",
	  contentType: "application/json; charset=utf-8",
	  type: "POST",
	  dataType: "text",
	  processData: false,
	  headers: {
		"New-Password": encodeURIComponent(newPassword),
		Authorization: "Basic " + btoa(userProfile.email + ":" + userProfile.password)
	  }
	});
  
	request.done(function(data) {
		userProfile.password = newPassword;
		setUserProfile(userProfile);
		setUserProfileForm(userProfile);
		alert("Passwort geändert.");
	});
  
	request.fail(function(jqXHR, textStatus, errorThrown) {
		var status = jqXHR.status;
		alert("Passwort konnte nicht geändert werden: " + textStatus + ", " + errorThrown);
	});  
}

function onChangePassword() {
	"use strict";
	$('#changePasswordModal').modal('show')
	return false;  
}

function onLogout() {
	"use strict";

	deleteUserProfile();
	document.reload();
	return false;
}
  
function onLogin() {
  "use strict";

  var email = $("#loginEmail").val();
  var password = $("#loginPassword").val();

  if (isBlank(email) || isBlank(password)) {
    alert("Bitte Email/Nickname und Passwort zum Login angeben");
    return false;
  }
  login();
  return false;
}

function login(quiet) {
  "use strict";

  var email = $("#loginEmail").val();
  var password = $("#loginPassword").val();

  if (isBlank(email) || isBlank(password)) {
    console.log("Not logged on");
    return;
  }

  var request = $.ajax({
    url: getAPIURI() + "/myProfile",
    contentType: "application/json; charset=utf-8",
    type: "GET",
    dataType: "json",
    processData: true,
    headers: {
      Authorization: "Basic " + btoa(email + ":" + password)
    }
  });

  request.done(function(data) {
    loggedIn = true;
    data.password = password;
    data.cc0 = data.license.startsWith("CC0");
    setUserProfile(data);
    setUserProfileForm(data);
    $("#loginProfile").css("visibility", "collapse");
    $("#fullProfile").css("visibility", "visible");
    if (!quiet) {
      alert("Login erfolgreich.");
    }
  });

  request.fail(function(jqXHR, textStatus, errorThrown) {
    badLogin(getUserProfile());
  });
}

function badLogin(userProfile) {
  "use strict";

  loggedIn = false;
  $("#loginProfile").css("visibility", "visible");
  $("#fullProfile").css("visibility", "collapse");
  alert("Login fehlgeschlagen.");
}

function togglePoints() {
  "use strict";

  $("#togglePoints")
    .toggleClass("fa-toggle-on")
    .toggleClass("fa-toggle-off");
  var showPoints = $("#togglePoints").hasClass("fa-toggle-on");
  localStorage.setItem("showPoints", showPoints ? "true" : "false");
}

function getUserProfileForm() {
  "use strict";

  var userProfile = getUserProfile();
  userProfile.nickname = $("#profileNickname").val();
  userProfile.email = $("#profileEmail").val();
  userProfile.password = $("#profilePassword").val();
  userProfile.photoOwner = $("#profilePhotoOwner").is(":checked");
  userProfile.anonymous = $("#profileAnonymous").is(":checked");
  userProfile.link = $("#profileLink").val();
  userProfile.cc0 = $("#profileCc0").is(":checked");
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
    headers: {
      Authorization:
        "Basic " + btoa(userProfile.email + ":" + userProfile.password)
    },
    data: JSON.stringify(userProfile)
  });

  request.done(function(data) {
    loggedIn = true;
    alert("Profil gespeichert");
  });

  request.fail(function(jqXHR, textStatus, errorThrown) {
    var status = jqXHR.status;
    if (status == 400) {
      alert("Ungültige Daten: " + textStatus + ", " + errorThrown);
    } else if (status == 401) {
      badLogin(userProfile);
    } else if (status == 409) {
      alert(
        "Es liegt ein Konflikt mit einem anderen Nickname oder einer Email vor. Bitte kontaktiere unseren Support: Bahnhofsfotos@deutschlands-Bahnhoefe.de"
      );
    } else {
      alert("Speichern fehlgeschlagen: " + textStatus + ", " + errorThrown);
    }
  });
}

function isURL(str) {
  try {
    var url = new URL(str);
    return url.protocol == "http:" || url.protocol == "https:";
  } catch (_) {
    return false;
  }
}

function onSaveProfile() {
  "use strict";

  var userProfile = getUserProfileForm();
  setUserProfile(userProfile);

  if (!userProfile.cc0) {
    alert(
      "Bitte akzeptiere CC0, damit wir Deine Fotos ohne Probleme verwenden können."
    );
    return false;
  }

  if (!userProfile.photoOwner) {
    alert("Bitte gib an, ob es sich um Deine eigenen Fotos handelt.");
    return false;
  }

  if (isBlank(userProfile.nickname)) {
    alert("Bitte gib Deinen Nickname an.");
    return false;
  }

  if (isBlank(userProfile.email)) {
    alert("Bitte gib Deine Email an.");
    return false;
  } else {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!userProfile.email.match(mailformat)) {
      alert("Ungültiges Email format.");
      return false;
    }
  }

  if (isNotBlank(userProfile.link) && !isURL(userProfile.link)) {
    alert("Bitte gib eine gültige HTTP(S) URL an.");
    return false;
  }

  if (!loggedIn && isBlank(userProfile.password)) {
    register(userProfile);
  } else {
    if (loggedIn && isNotBlank(userProfile.password)) {
      uploadProfile(userProfile);
    } else {
      alert("Benutzerprofil gespeichert");
    }
  }

  return false;
}

function onNewRegistration() {
  "use strict";

  $("#loginProfile").css("visibility", "collapse");
  $("#fullProfile").css("visibility", "visible");
}

function setUserProfileForm(userProfile) {
  "use strict";

  if (isNotBlank(userProfile.email)) {
    $("#loginEmail").val(userProfile.email);
  } else {
    $("#loginEmail").val(userProfile.nickname);
  }
  $("#loginPassword").val(userProfile.password);

  $("#profileNickname").val(userProfile.nickname);
  $("#profileEmail").val(userProfile.email);
  $("#profilePassword").val(userProfile.password);
  $("#profilePhotoOwner").prop(
    "checked",
    userProfile.photoOwner || userProfile.photoOwner === "true"
  );
  $("#profileAnonymous").prop(
    "checked",
    userProfile.anonymous || userProfile.anonymous === "true"
  );
  $("#profileLink").val(userProfile.link);
  $("#profileCc0").prop(
    "checked",
    userProfile.cc0 || userProfile.cc0 === "true"
  );

  if (loggedIn) {
    $("#saveProfile").html("Speichern");
  } else {
    $("#saveProfile").html("Registrieren");
  }
}

$(document).ready(function() {
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
