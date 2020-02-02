import $ from "jquery";
import {
  getAPIURI,
  scaleImage,
  fetchCountries,
  getUserProfile
} from "./common";
import "bootstrap";
import { getI18n } from "./i18n";

window.$ = $;
window.importPhoto = importPhoto;
window.rejectPhoto = rejectPhoto;

function sendInboxCommand(upload) {
  "use strict";

  console.log(upload);

  var userProfile = getUserProfile();
  var request = $.ajax({
    url: getAPIURI() + "photoUpload/inbox",
    contentType: "application/json; charset=utf-8",
    type: "POST",
    dataType: "text",
    processData: false,
    headers: {
      Authorization:
        "Basic " + btoa(userProfile.email + ":" + userProfile.password)
    },
    data: JSON.stringify(upload)
  });

  request.done(function(data) {
    $("#upload-" + upload.id).attr("style", "visibility: collapse")
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

function importPhoto(uploadId) {
  "use strict";

  var forceImport = $("#forceImport-" + uploadId).is(":checked");
  var countryCode = $("#country-" + uploadId).val();
  var stationId = $("#stationId-" + uploadId).val();
  var command = forceImport ? "FORCE_IMPORT" : "IMPORT";

  var upload = {id: uploadId, countryCode: countryCode, stationId: stationId, command: command};
  sendInboxCommand(upload)
}

function rejectPhoto(uploadId) {
  "use strict";

  var rejectReason = prompt(getI18n(s => s.inbox.enterRejectReason));

  if (rejectReason == null || rejectReason == "") {
    alert(getI18n(s => s.inbox.rejectionCanceled));
    return;
  }

  var upload = {id: uploadId, rejectReason: rejectReason, command: "REJECT"};
  sendInboxCommand(upload)
}

function createCountriesDropDown(countries, uploadId) {
  "use strict";

  let countryOptions = `<select class="form-control" id="country-${uploadId}">
    <option value="">${getI18n(s => s.inbox.selectCountry)}</option>`

    countries.forEach(country => {
      countryOptions += `<option value="${country.code}">${country.name}</option>`;
    });

  countryOptions += `</select>`;
  return countryOptions;
}

$(document).ready(function() {
  var userProfile = getUserProfile();

  fetchCountries().then(countries => {
    $.ajax({
      url: `${getAPIURI()}photoUpload/inbox`,
      type: "GET",
      dataType: "json",
      crossDomain: true,
      headers: {
        Authorization:
          "Basic " + btoa(userProfile.email + ":" + userProfile.password)
      },
      error: function() {
        $("#uploads").html(getI18n(s => s.inbox.errorLoadingPendingUploads));
      },
      success: function(obj) {
        if (Array.isArray(obj) && obj.length > 0) {
          for (let i = 0; i < obj.length; i++) {
            let upload = obj[i];
            var createdAt = new Date(0); // The 0 there is the key, which sets the date to the epoch
            createdAt.setUTCSeconds(upload.createdAt / 1000);
            const isProcessed = upload.isProcessed;
            var processedIcon = "";
            if (isProcessed) {
              processedIcon = ` <i class="fas fa-check" title="${getI18n(s => s.inbox.processed)}"></i>`;
            } else {
              processedIcon = ` <i class="fas fa-hourglass-start" title="${getI18n(s => s.inbox.toProcess)}"></i>`;
            }
            const inboxUrl = getAPIURI() + "inbox/" + (isProcessed ? "processed/" : "") + upload.filename;
            var comment = "";
            if (upload.uploadComment !== undefined) {
              comment = `<p class="card-text"><small class="text-muted">${upload.uploadComment}</small></p>`;
            }
            var conflictIcon = "";
            var forceImport = "";
            if (upload.hasConflict) {
              forceImport = `<p class="card-text"><input id="forceImport-${upload.id}" name="forceImport-${upload.id}" type="checkbox"/>
              <label for="forceImport-${upload.id}">${getI18n(s => s.inbox.ignoreConflict)}</label></p>`
            }
            if (upload.hasPhoto) {
              forceImport = `<p class="card-text"><input id="forceImport-${upload.id}" name="forceImport-${upload.id}" type="checkbox"/>
                  <label for="forceImport-${upload.id}">${getI18n(s => s.inbox.overwriteExistingPhoto)}</label></p>`
            } 
            if (upload.hasConflict || upload.hasPhoto) {
              conflictIcon = ` <i class="fas fa-exclamation-triangle" title="${getI18n(s => s.inbox.conflict)}"></i>`;
            }
            var ghostIcon = "";
            if (upload.isGhost) {
              ghostIcon = ` <i class="fas fa-ghost" title="${getI18n(s => s.inbox.ghost)}"></i>`;
              forceImport = `<p class="card-text"><input id="forceImport-${upload.id}" name="forceImport-${upload.id}" type="checkbox"/>
                  <label for="forceImport-${upload.id}">${getI18n(s => s.inbox.deleteGhost)}</label></p>`
            }
            var coords = "";
            var stationKey = "";
            if (upload.stationId === undefined) {
              forceImport = `<p class="card-text"><input id="forceImport-${upload.id}" name="forceImport-${upload.id}" type="checkbox"/>
                  <label for="forceImport-${upload.id}">${getI18n(s => s.inbox.createStation)}</label></p>`
              coords = `<p class="card-text"><small class="text-muted"><a href="http://www.openstreetmap.org/?mlat=${
                      upload.lat}&mlon=${upload.lon}&zoom=18&layers=M" target="_blank">${
                      upload.lat},${upload.lon}</a></small></p>`;
              stationKey = `<p class="card-text">${getI18n(s => s.inbox.missingStation)}:<br>
                            ${createCountriesDropDown(countries, upload.id)}</p>
                      <p class="card-text"><input id="stationId-${upload.id}" name="stationId-${upload.id}" type="text" placeholder="Station ID"/></p>`
                } 
            const detailLink = `station.php?countryCode=${upload.countryCode}&stationId=${upload.stationId}`;
            $("#uploads").append(`
<div class="col mb-4" id="upload-${upload.id}">            
  <div class="card" style="max-width: 303px;">
    <div class="card-body">
      <h5 class="card-title"><a href="${detailLink}" data-ajax="false">${upload.id}: ${upload.title}</a>${conflictIcon}${ghostIcon}${processedIcon}</h5>
      <p class="card-text">
        ${upload.photographerNickname}<br>
        ${createdAt.toLocaleString()}
      </p>
      ${coords}
      ${comment}
      ${stationKey}
      ${forceImport}
      <p class="card-text">
        <button class="btn btn-success" name="importPhoto-${upload.id}"
                    onclick="return importPhoto(${upload.id});">${getI18n(s => s.inbox.import)} <i class="fas fa-thumbs-up"></i></button>
        <button class="btn btn-danger" name="rejectPhoto-${upload.id}"
                    onclick="return rejectPhoto(${upload.id});">${getI18n(s => s.inbox.reject)} <i class="fas fa-thumbs-down"></i></button>
      </p>
    </div>
    <a href="${inboxUrl}" data-ajax="false" target="_blank">
        <img src="${inboxUrl}?width=301" class="card-img-top" alt="${upload.title}">
    </a>
  </div>
</div>`);
          }
        } else {
          $("#uploads").html(getI18n(s => s.inbox.noUploadsFound));
        }
      }
    });
  });
});
