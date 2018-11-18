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
        result = 'Upload-Token ungültig';
      } else if (result.startsWith('409')) {
        result = 'Foto upload erfolgreich, eventuell gibt es aber einen Konflikt';
      } else if (result.startsWith('413')) {
        result = 'Foto zu groß (maximal 20 MB)';
      }

      document.getElementById('result').innerHTML =
           '<span class="msg">' + result + '<\/span><br/><br/>';
      document.getElementById('f1_upload_process').style.visibility = 'hidden';
      return true;
}

window.addEventListener("message", receiveMessage, false);

function receiveMessage(event) {
  stopUpload(event.data);
}

function register(userProfile) {
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
        document.getElementById('resultProfile').innerHTML =
             '<span class="msg">Registrierung erfolgreich<\/span><br/><br/>';
			});

	request.fail(function (jqXHR, textStatus, errorThrown) {
    document.getElementById('resultProfile').innerHTML =
         '<span class="msg">Registrierung fehlgeschlagen: ' + textStatus + ', ' + errorThrown + '<\/span><br/><br/>';
			});

}

function saveProfile() {
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
  setUserProfile(userProfile);
  setUserProfileInUploadForm(userProfile);
  if (userProfile.uploadToken === undefined || userProfile.uploadToken.length == 0) {
    register(userProfile);
  } else {
    document.getElementById('resultProfile').innerHTML =
         '<span class="msg">Benutzerprofil gespeichert<\/span><br/><br/>';
  }

  return true;
}

function setUserProfileInUploadForm(userProfile) {
  "use strict";

  $("#email").val(userProfile.email);
  $("#uploadToken").val(userProfile.uploadToken);

  var uploadDisabled = !(userProfile.email.length > 0 && userProfile.uploadToken.length > 0);
  $("#fileInput").attr("disabled", uploadDisabled);
  $("#uploadSubmit").attr("disabled", uploadDisabled);
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
  setUserProfileInUploadForm(userProfile);

  $("#profileNickname").val(userProfile.nickname);
  $("#profileEmail").val(userProfile.email);
  $("#profileUploadToken").val(userProfile.uploadToken);
  if (userProfile.photoOwner || userProfile.photoOwner === "true") {
    $("#profilePhotoOwner").attr('checked','checked');
  }
  if (userProfile.anonymous || userProfile.anonymous === "true") {
    $("#profileAnonymous").attr('checked','checked');
  }
  $("#profileLink").val(userProfile.link);
  if (userProfile.cc0 || userProfile.cc0 === "true") {
    $("#profileCc0").attr('checked','checked');
  }

});
