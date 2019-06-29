/*jslint browser: true*/
/*global $,L*/
//-----------------------------------------------------------------------

function startUpload(){
    document.getElementById('f1_upload_process').style.visibility = 'visible';
    return true;
}

function stopUpload(message){
      var result = message;
      if (result.startsWith('202')) {
        result = 'Foto upload erfolgreich';
      } else if (result.startsWith('400')) {
        result = 'Upload ungültig (z.B. nicht unterstützter Dateityp)';
      } else if (result.startsWith('401')) {
        window.location.href = "settings.html";
        return false;
      } else if (result.startsWith('409')) {
        result = 'Foto upload erfolgreich, eventuell gibt es aber einen Konflikt';
      } else if (result.startsWith('413')) {
        result = 'Foto zu groß (maximal 20 MB)';
      }

      alert(result);
      document.getElementById('f1_upload_process').style.visibility = 'hidden';
      return true;
}

window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
  stopUpload(event.data);
}

$(document).ready(function () {
	"use strict";
	var vars = getQueryParameter();
	var stationId = vars.stationId;
	var countryCode = vars.countryCode;
  var title = vars.title;
  var userProfile = getUserProfile();

  $("#title-form").html("Upload Foto für " + title);
  $("#stationId").val(stationId);
  $("#countryCode").val(countryCode);
  $("#uploadForm").attr("action", getAPIURI() + "photoUpload");
  $("#email").val(userProfile.email);
  $("#uploadToken").val(userProfile.uploadToken);
  if (!stationId || stationId.length == 0) {
    alert('Kein Bahnhof gefunden');
  }

  var uploadDisabled = isBlank(userProfile.email) || isBlank(userProfile.uploadToken);
  $("#fileInput").attr("disabled", uploadDisabled);
  $("#uploadSubmit").attr("disabled", uploadDisabled);
  if (uploadDisabled) {
    window.location.href = "settings.html";
  }
});
