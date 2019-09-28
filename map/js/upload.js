/*jslint browser: true*/
/*global $,L*/
//-----------------------------------------------------------------------

function startUpload() {
  $("#upload-process").modal("show");
  return true;
}

function stopUpload(message) {
  var result = message;
  if (result.startsWith("202")) {
    result = "Foto upload erfolgreich";
  } else if (result.startsWith("400")) {
    result = "Upload ungültig (z.B. nicht unterstützter Dateityp)";
  } else if (result.startsWith("401")) {
    window.location.href = "settings.html";
    return false;
  } else if (result.startsWith("409")) {
    result = "Foto upload erfolgreich, eventuell gibt es aber einen Konflikt";
  } else if (result.startsWith("413")) {
    result = "Foto zu groß (maximal 20 MB)";
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
  "use strict";
  var vars = getQueryParameter();
  var stationId = vars.stationId;
  var countryCode = vars.countryCode;
  var latitude = vars.latitude;
  var longitude = vars.longitude;
  var title = vars.title;
  var userProfile = getUserProfile();

  if (stationId) {
    $("#title-form").html("Upload Foto für " + title);
    $("#stationId").val(stationId);
    $("#countryCode").val(countryCode);
    $(".missing-station").hide();
    $("#inputLatitude").attr("required", false);
    $("#inputLongitude").attr("required", false);
    $("#inputStationTitle").attr("required", false);
  } else {
    $("#inputLatitude").val(latitude);
    $("#inputLongitude").val(longitude);
  }
  $("#uploadForm").attr("action", getAPIURI() + "photoUpload");
  $("#email").val(userProfile.email);
  $("#uploadToken").val(userProfile.uploadToken);

  var uploadDisabled =
    isBlank(userProfile.email) || isBlank(userProfile.uploadToken);
  $("#fileInput").attr("disabled", uploadDisabled);
  $("#uploadSubmit").attr("disabled", uploadDisabled);
  if (uploadDisabled) {
    window.location.href = "settings.html";
  } else {
    bsCustomFileInput.init();
  }

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.getElementsByClassName("needs-validation");
  // Loop over them and prevent submission
  var validation = Array.prototype.filter.call(forms, function(form) {
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
