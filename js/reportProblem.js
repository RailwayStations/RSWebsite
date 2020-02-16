import $ from "jquery";
import {
  getAPIURI,
  getQueryParameter,
  isBlank
} from "./common";
import "bootstrap";
import { getI18n } from "./i18n";
import { UserProfile } from "./settings/UserProfile";

window.reportProblem = reportProblem;

export function reportProblem() {
  "use strict";

  $("#inputType").attr("required","");
  var type = $("#inputType").val();
  if (isBlank(type)) {
    $("#inputType").addClass(":invalid");
    $("#reportProblemForm").addClass("was-validated");
    return false;
  } else {
    $("#inputType").removeClass(":invalid");
  }

  $("#inputComment").attr("required","");
  var comment = $("#inputComment").val();
  if (isBlank(comment)) {
    $("#inputComment").addClass(":invalid");
    $("#reportProblemForm").addClass("was-validated");
    return false;
  } else {
    $("#inputComment").removeClass(":invalid");
  }

  var r = confirm(getI18n(s => s.reportProblem.confirmProblemReport));
  if (r == true) {
    const userProfile = UserProfile.currentUser();
    var stationId = $("#stationId").val();
    var countryCode = $("#countryCode").val();
    var problemReport = {countryCode: countryCode, stationId: stationId, type: type, comment: comment};

    var request = $.ajax({
      url: getAPIURI() + "reportProblem",
      type: "POST",
      contentType: "application/json; charset=utf-8",
      processData: false,
      headers: {
        Authorization:
          "Basic " + btoa(userProfile.email + ":" + userProfile.password)
      },
      data: JSON.stringify(problemReport)
    });
  
    request.done(function(data) {
      alert(getI18n(s => s.reportProblem.reportProblemSuccess))
    });
  
    request.fail(function(jqXHR, textStatus, errorThrown) {
      if (jqXHR.responseText) {
        var response = JSON.parse(jqXHR.responseText)
        alert(
            errorThrown + 
            ": " + 
            response.message 
        );
      } else {
        alert(textStatus + ": " + errorThrown);
      }
    });
  }
}

$(document).ready(function() {
  const queryParameters = getQueryParameter();
  const stationId = queryParameters.stationId;
  const countryCode = queryParameters.countryCode;
  const title = queryParameters.title;
  const userProfile = UserProfile.currentUser();

  if (stationId) {
    $("#title-form").html(getI18n(s => s.reportProblem.reportProblemFor + " " + title));
    $("#stationId").val(stationId);
    $("#countryCode").val(countryCode);
  }

  const reportDisabled =
    isBlank(userProfile.email) || isBlank(userProfile.password);
  if (reportDisabled) {
    window.location.href = "settings.php";
  }

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.getElementsByClassName("needs-validation");
  // Loop over them and prevent submission
  const validation = Array.prototype.filter.call(forms, function(form) {
    form.addEventListener(
      "submit",
      function(event) {
        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        } else {
          startUpload();
        }
        form.classList.add("was-validated");
      },
      false
    );
  });
});
