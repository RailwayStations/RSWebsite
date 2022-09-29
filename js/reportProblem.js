import $ from "jquery";
import { getAPIURI, getQueryParameter, isBlank, initRSAPI } from "./common";
import "bootstrap";
import { getI18n } from "./i18n";
import { UserProfile } from "./settings/UserProfile";

window.reportProblem = reportProblem;
window.changeProblemType = changeProblemType;

export function reportProblem() {
  "use strict";

  var type = $("#inputType").val();
  var latitude = $("#inputLatitude").val();
  var longitude = $("#inputLongitude").val();
  var comment = $("#inputComment").val();

  var r = confirm(getI18n(s => s.reportProblem.confirmProblemReport));
  if (r == true) {
    const userProfile = UserProfile.currentUser();
    var stationId = $("#stationId").val();
    var countryCode = $("#countryCode").val();
    var problemReport = {
      countryCode: countryCode,
      stationId: stationId,
      type: type,
      comment: comment,
      lat: latitude,
      lon: longitude,
    };

    var request = $.ajax({
      url: getAPIURI() + "reportProblem",
      type: "POST",
      contentType: "application/json; charset=utf-8",
      processData: false,
      headers: {
        Authorization:
          "Basic " + btoa(userProfile.email + ":" + userProfile.password),
      },
      data: JSON.stringify(problemReport),
    });

    request.done(function (data) {
      alert(getI18n(s => s.reportProblem.reportProblemSuccess));
      window.location.href = "index.php";
    });

    request.fail(function (jqXHR, textStatus, errorThrown) {
      if (jqXHR.responseText) {
        var response = JSON.parse(jqXHR.responseText);
        alert(errorThrown + ": " + response.message);
      } else {
        alert(textStatus + ": " + errorThrown);
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
}

function initReportProblem() {
  const queryParameters = getQueryParameter();
  const stationId = queryParameters.stationId;
  const countryCode = queryParameters.countryCode;
  const title = queryParameters.title;
  const photoId = queryParameters.photoId;
  const userProfile = UserProfile.currentUser();

  if (stationId) {
    $("#title-form").html(
      getI18n(s => s.reportProblem.reportProblemFor + " " + title)
    );
    $("#stationId").val(stationId);
    $("#countryCode").val(countryCode);
    $("#photoId").val(photoId);
    $(".coords").hide();
  }

  const reportDisabled =
    isBlank(userProfile.email) || isBlank(userProfile.password);
  if (reportDisabled) {
    window.location.href = "settings.php";
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

$(function () {
  initRSAPI().then(function () {
    initReportProblem();
  });
});
