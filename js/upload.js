import $ from "jquery";
import bsCustomFileInput from "bs-custom-file-input";
import {
  getAPIURI,
  getQueryParameter,
  getUserProfile,
  isBlank
} from "./common";
import "bootstrap";
import { getI18n } from "./i18n";

function startUpload() {
  $("#upload-process").modal("show");
  return true;
}

function stopUpload(message) {
  let result = message;
  if (result.startsWith("202")) {
    result = getI18n(s => s.upload.successful);
  } else if (result.startsWith("400")) {
    result = getI18n(s => s.upload.invalid);
  } else if (result.startsWith("401")) {
    window.location.href = "settings.php";
    return false;
  } else if (result.startsWith("409")) {
    result = getI18n(s => s.upload.conflict);
  } else if (result.startsWith("413")) {
    result = getI18n(s => s.upload.maxSize);
  }

  $("#upload-process").modal("hide");
  alert(result);
  return true;
}

window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
  stopUpload(event.data);
}

$(document).ready(function() {
  const queryParameters = getQueryParameter();
  const stationId = queryParameters.stationId;
  const countryCode = queryParameters.countryCode;
  const latitude = queryParameters.latitude;
  const longitude = queryParameters.longitude;
  const title = queryParameters.title;
  const userProfile = getUserProfile();

  if (stationId) {
    $("#title-form").html(getI18n(s => s.upload.uploadPhotoFor + " " + title));
    $("#stationId").val(stationId);
    $("#countryCode").val(countryCode);
    $(".missing-station").hide();
    $("#inputLatitude").removeAttr("required");
    $("#inputLongitude").removeAttr("required");
    $("#inputStationTitle").removeAttr("required");
  } else {
    $("#inputLatitude").val(latitude);
    $("#inputLongitude").val(longitude);
  }
  $("#uploadForm").attr("action", getAPIURI() + "photoUpload");
  $("#email").val(userProfile.email);
  $("#uploadToken").val(userProfile.password);

  const uploadDisabled =
    isBlank(userProfile.email) || isBlank(userProfile.password);
  $("#fileInput").attr("disabled", uploadDisabled);
  $("#uploadSubmit").attr("disabled", uploadDisabled);
  if (uploadDisabled) {
    window.location.href = "settings.php";
  } else {
    bsCustomFileInput.init();
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
