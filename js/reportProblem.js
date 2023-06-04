import $ from "jquery";
import { getAPIURI, getQueryParameter, getAuthorization } from "./common";
import "bootstrap";
import { getI18n } from "./i18n";
import { UserProfile } from "./settings/UserProfile";
import { UserProfileClient } from "./settings/client/UserProfileClient";

window.reportProblem = reportProblem;
window.changeProblemType = changeProblemType;

function showError(message) {
  "use strict";

  document.getElementById("error").innerText = message;
  document.getElementById("error").classList.remove("hidden");
  setTimeout(function () {
    document.getElementById("error").classList.add("hidden");
  }, 5000);
}

function showSuccess(message) {
  "use strict";

  document.getElementById("success").innerText = message;
  document.getElementById("success").classList.remove("hidden");
  setTimeout(function () {
    document.getElementById("success").classList.add("hidden");
  }, 5000);
}

export function reportProblem() {
  "use strict";

  var type = $("#inputType").val();
  var latitude = $("#inputLatitude").val();
  var longitude = $("#inputLongitude").val();
  var comment = $("#inputComment").val();
  var title = $("#inputTitle").val();
  var photoId = $("#photoId").val();

  var r = confirm(getI18n(s => s.reportProblem.confirmProblemReport));
  if (r == true) {
    var stationId = $("#stationId").val();
    var countryCode = $("#countryCode").val();
    var problemReport = {
      countryCode: countryCode,
      stationId: stationId,
      type: type,
      comment: comment,
      title: title,
      lat: latitude,
      lon: longitude,
      photoId: photoId,
    };

    var request = $.ajax({
      url: getAPIURI() + "reportProblem",
      type: "POST",
      contentType: "application/json; charset=utf-8",
      processData: false,
      headers: {
        Authorization: getAuthorization(),
      },
      data: JSON.stringify(problemReport),
    });

    request.done(function (data) {
      showSuccess(getI18n(s => s.reportProblem.reportProblemSuccess));
    });

    request.fail(function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.responseText) {
        var response = JSON.parse(jqXHR.responseText);
        showError(errorThrown + ": " + response.message);
      } else {
        showError(textStatus + " " + errorThrown);
      }
    });
  } else {
    return false;
  }
}

export function changeProblemType() {
  var type = $("#inputType").val();
  if (type === "WRONG_LOCATION") {
    $(".coords").show();
    $("#inputLatitude").attr("required", "");
    $("#inputLongitude").attr("required", "");
  } else {
    $(".coords").hide();
    $("#inputLatitude").removeAttr("required");
    $("#inputLongitude").removeAttr("required");
  }

  if (type === "WRONG_NAME") {
    $(".title").show();
    $("#inputTitle").attr("required", "");
  } else {
    $(".title").hide();
    $("#inputTitle").removeAttr("required");
  }
}

function initReportProblemForm() {
  const queryParameters = getQueryParameter();
  const stationId = queryParameters.stationId;
  const countryCode = queryParameters.countryCode;
  const title = queryParameters.title;
  const lat = queryParameters.lat;
  const lon = queryParameters.lon;
  const photoId = queryParameters.photoId;

  if (stationId) {
    $("#title-form").html(
      getI18n(s => s.reportProblem.reportProblemFor + " " + title)
    );
    $("#stationId").val(stationId);
    $("#countryCode").val(countryCode);
    $("#photoId").val(photoId);
    $(".coords").hide();
    $("#inputLatitude").val(lat);
    $("#inputLongitude").val(lon);
    $(".title").hide();
    $("#inputTitle").val(title);
  }

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.getElementsByClassName("needs-validation");
  // Loop over them and prevent submission
  Array.prototype.filter.call(forms, function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        event.preventDefault();
        event.stopPropagation();
        if (form.checkValidity() !== false) {
          reportProblem();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
}

function initReportProblem() {
  if (!UserProfile.isLoggedIn()) {
    window.location.href =
      "settings.php?error=" +
      encodeURIComponent(getI18n(s => s.settings.pleaseLogIn));
    return;
  }

  // get updated user profile
  UserProfileClient.getProfile(UserProfile.currentUser()).then(
    userProfile => {
      userProfile.save();
      if (!userProfile.isAllowedToReportProblem()) {
        location.href =
          "settings.php?warning=" +
          encodeURIComponent(
            `${getI18n(s => s.reportProblem.notAllowedToReportProblem)}`
          );
      } else {
        initReportProblemForm();
      }
    },
    error => {
      localStorage.removeItem("access_token");
      location.href =
        "settings.php?error=" +
        encodeURIComponent(`${getI18n(s => s.settings.loginFailed)}`);
    }
  );
}

$(function () {
  initReportProblem();
});
