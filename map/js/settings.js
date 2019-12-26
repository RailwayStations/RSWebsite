/*jslint browser: true*/
/*global $,L*/
//-----------------------------------------------------------------------
var loggedIn = false;

function register(userProfile, passwordResetOnly) {
  "use strict";

  console.log(JSON.stringify(userProfile));
  saveBtnSpinning(true);

  var request = $.ajax({
    url: getAPIURI() + "/registration",
    contentType: "application/json; charset=utf-8",
    type: "POST",
    dataType: "text",
    processData: false,
    data: JSON.stringify(userProfile)
  });

  request.done(function(data) {
    saveBtnSpinning(false);
    if (passwordResetOnly) {
      alert(window.i18n.settings.newPasswordViaEmail);
    } else {
      alert(window.i18n.settings.registrationSuccessfully);
      $("#loginEmail").val(userProfile.email);
      $(".login-form").show();
      $(".profile-form").hide();
    }
  });

  request.fail(function(jqXHR, textStatus, errorThrown) {
    saveBtnSpinning(false);
    var status = jqXHR.status;
    if (status == 400) {
      alert(
        window.i18n.settings.invalidData +
          ": " +
          textStatus +
          ", " +
          errorThrown
      );
    } else if (status == 409) {
      alert(
        window.i18n.settings.conflict +
          ": Bahnhofsfotos@deutschlands-Bahnhoefe.de"
      );
    } else {
      alert(
        window.i18n.settings.conflict + ": " + textStatus + ", " + errorThrown
      );
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
    alert(window.i18n.settings.newPasswordViaEmail);
  });

  request.fail(function(jqXHR, textStatus, errorThrown) {
    var status = jqXHR.status;
    if (status == 400) {
      alert(
        window.i18n.settings.missingEMail +
          ": Bahnhofsfotos@deutschlands-Bahnhoefe.de"
      );
    } else if (status == 404) {
      alert(window.i18n.settings.noProfileFound);
    } else {
      alert(
        window.i18n.settings.error + ": " + textStatus + ", " + errorThrown
      );
    }
  });
}

function onResetPassword() {
  "use strict";

  var nameOrEmail = $("#loginEmail").val();

  if (isBlank(nameOrEmail)) {
    alert(window.i18n.settings.pleaseEnterNicknameEmail);
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
    alert(window.i18n.settings.passwordMinLength);
    return false;
  }
  if (newPassword !== newPasswordRepeat) {
    alert(window.i18n.settings.passwordMismatch);
    return false;
  }
  $("#changePasswordModal").modal("hide");

  var userProfile = getUserProfileForm();

  var request = $.ajax({
    url: getAPIURI() + "/changePassword",
    contentType: "application/json; charset=utf-8",
    type: "POST",
    dataType: "text",
    processData: false,
    headers: {
      "New-Password": encodeURIComponent(newPassword),
      Authorization:
        "Basic " + btoa(userProfile.email + ":" + userProfile.password)
    }
  });

  request.done(function(data) {
    userProfile.password = newPassword;
    setUserProfile(userProfile);
    setUserProfileForm(userProfile);
    alert(window.i18n.settings.passwordChanges);
  });

  request.fail(function(jqXHR, textStatus, errorThrown) {
    var status = jqXHR.status;
    alert(
      window.i18n.settings.unableToChangePassword +
        ": " +
        textStatus +
        ", " +
        errorThrown
    );
  });
  return false;
}

function onChangePassword() {
  "use strict";
  $("#changePasswordModal").modal("show");
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
    alert(window.i18n.settings.provideEmailNicknameForLogin);
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
    $(".login-form").show();
    $(".profile-form").hide();
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

    $(".login-form").hide();
    $(".profile-form").show();
    if (!quiet) {
      alert(window.i18n.settings.loginSuccessful);
    }
  });

  request.fail(function(jqXHR, textStatus, errorThrown) {
    badLogin(getUserProfile());
  });
}

function badLogin(userProfile) {
  "use strict";

  loggedIn = false;
  $(".login-form").show();
  $(".profile-form").hide();
  alert(window.i18n.settings.loginFailed);
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

  saveBtnSpinning(true);
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
    saveBtnSpinning(false);
    alert(window.i18n.settings.profileSaved);
  });

  request.fail(function(jqXHR, textStatus, errorThrown) {
    saveBtnSpinning(false);
    var status = jqXHR.status;
    if (status == 400) {
      alert(
        window.i18n.settings.invalidData +
          ": " +
          textStatus +
          ", " +
          errorThrown
      );
    } else if (status == 401) {
      badLogin(userProfile);
    } else if (status == 409) {
      alert(
        window.i18n.settings.conflict +
          ": Bahnhofsfotos@deutschlands-Bahnhoefe.de"
      );
    } else {
      alert(
        window.i18n.settings.profileSavedFailed +
          ": " +
          textStatus +
          ", " +
          errorThrown
      );
    }
  });
}

function saveBtnSpinning(spinning) {
  "use strict";

  if (spinning) {
    $("#saveProfile .spinner-border").show();
  } else {
    $("#saveProfile .spinner-border").hide();
  }
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
    alert(window.i18n.settings.acceptCC0);
    return false;
  }

  if (!userProfile.photoOwner) {
    alert(window.i18n.settings.ownPhotos);
    return false;
  }

  if (isBlank(userProfile.nickname)) {
    alert(window.i18n.settings.provideNickname);
    return false;
  }

  if (isBlank(userProfile.email)) {
    alert(window.i18n.settings.provideEmail);
    return false;
  } else {
    var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!userProfile.email.match(mailformat)) {
      alert(window.i18n.settings.invalidEmail);
      return false;
    }
  }

  if (isNotBlank(userProfile.link) && !isURL(userProfile.link)) {
    alert(window.i18n.settings.provideValidUrl);
    return false;
  }

  if (!loggedIn && isBlank(userProfile.password)) {
    register(userProfile);
  } else {
    if (loggedIn && isNotBlank(userProfile.password)) {
      uploadProfile(userProfile);
    } else {
      alert(window.i18n.settings.profileSaved);
    }
  }

  return false;
}

function onNewRegistration() {
  "use strict";

  $(".login-form").hide();
  $(".profile-form").show();
  $(".logged-in").hide();
  $("#profilePassword").val("");
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
    $("#saveBtnText").html(window.i18n.settings.save);
  } else {
    $("#saveBtnText").html(window.i18n.settings.register);
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

  $("#saveProfile .spinner-border").hide();

  $(function() {
    $(".modal-content").keypress(function(e) {
      if (e.which == 13) {
        changePassword();
      }
    });
  });

  login(true);
});
