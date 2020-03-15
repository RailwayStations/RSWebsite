import $ from "jquery";
import { getAPIURI, fetchCountries, isNotBlank, getIntFromLocalStorage } from "./common";
import "bootstrap";
import { getI18n } from "./i18n";
import { UserProfile } from "./settings/UserProfile";

window.$ = $;
window.accept = accept;
window.reject = reject;
window.changeSinceHours = changeSinceHours;

function sendInboxCommand(inboxCommand) {
  "use strict";

  console.log(inboxCommand);

  const userProfile = UserProfile.currentUser();
  var request = $.ajax({
    url: getAPIURI() + "adminInbox",
    contentType: "application/json; charset=utf-8",
    type: "POST",
    dataType: "text",
    processData: false,
    headers: {
      Authorization:
        "Basic " + btoa(userProfile.email + ":" + userProfile.password)
    },
    data: JSON.stringify(inboxCommand)
  });

  request.done(function(data) {
    $("#inbox-" + inboxCommand.id).attr("style", "visibility: collapse");
    fetchRecentPhotoImports();
  });

  request.fail(function(jqXHR, textStatus, errorThrown) {
    if (jqXHR.responseText) {
      var response = JSON.parse(jqXHR.responseText);
      alert(errorThrown + ": " + response.message);
    } else {
      alert(textStatus + ": " + errorThrown);
    }
  });
}

function accept(id) {
  "use strict";

  var forceImport = $("#forceImport-" + id).is(":checked");
  var countryCode = $("#country-" + id).val();
  var stationId = $("#stationId-" + id).val();
  var ds100 = $("#ds100-" + id).val();
  var active = $("#active-" + id).is(":checked");
  var command = forceImport ? "FORCE_IMPORT" : "IMPORT";
  var problemSolving = $("#problemSolving-" + id).val();
  if (problemSolving !== undefined) {
    if (problemSolving === "") {
      alert(getI18n(s => s.inbox.chooseProblemSolving));
      return;
    }
    command = problemSolving;
  }

  var inboxCommand = {
    id: id,
    countryCode: countryCode,
    stationId: stationId,
    command: command,
    DS100: ds100,
    active: active
  };
  sendInboxCommand(inboxCommand);
}

function reject(id) {
  "use strict";

  var rejectReason = prompt(getI18n(s => s.inbox.enterRejectReason));

  if (rejectReason == null || rejectReason == "") {
    alert(getI18n(s => s.inbox.rejectionCanceled));
    return;
  }

  var inboxCommand = { id: id, rejectReason: rejectReason, command: "REJECT" };
  sendInboxCommand(inboxCommand);
}

function createCountriesDropDown(countries, id) {
  "use strict";

  let countryOptions = `<select class="form-control" id="country-${id}">
    <option value="">${getI18n(s => s.inbox.selectCountry)}</option>`;

  countries.forEach(country => {
    countryOptions += `<option value="${country.code}">${country.name}</option>`;
  });

  countryOptions += `</select>`;
  return countryOptions;
}

function fetchAdminInbox(userProfile) {
  "use strict";

  fetchCountries().then(countries => {
    $.ajax({
      url: `${getAPIURI()}adminInbox`,
      type: "GET",
      dataType: "json",
      crossDomain: true,
      headers: {
        Authorization:
          "Basic " + btoa(userProfile.email + ":" + userProfile.password)
      },
      error: function() {
        $("#inboxEntries").html(
          getI18n(s => s.inbox.errorLoadingPendingUploads)
        );
      },
      success: function(obj) {
        if (Array.isArray(obj) && obj.length > 0) {
          for (let i = 0; i < obj.length; i++) {
            let inbox = obj[i];
            var createdAt = new Date(0); // The 0 there is the key, which sets the date to the epoch
            createdAt.setUTCSeconds(inbox.createdAt / 1000);
            const isProcessed = inbox.isProcessed;
            var processedIcon = "";
            var image = "";
            var acceptDisabled = "";
            if (isNotBlank(inbox.filename)) {
              if (isProcessed) {
                processedIcon = ` <i class="fas fa-check" title="${getI18n(
                  s => s.inbox.processed
                )}"></i>`;
              } else {
                processedIcon = ` <i class="fas fa-hourglass-start" title="${getI18n(
                  s => s.inbox.toProcess
                )}"></i>`;
                acceptDisabled = "disabled";
              }
              image = `<a href="${inbox.inboxUrl}" data-ajax="false" target="_blank">
                       <img src="${inbox.inboxUrl}?width=301" class="card-img-top" alt="${inbox.title}">
                       </a>`;
            }
            var comment = "";
            if (inbox.comment !== undefined) {
              comment = `<p class="card-text"><small class="text-muted">${inbox.comment}</small></p>`;
            }
            var problemIcon = "";
            var problemType = "";
            var problemSolving = "";
            if (inbox.problemReportType !== undefined) {
              problemIcon = ` <i class="fas fa-bullhorn" title="${getI18n(
                s => s.inbox.problemReport
              )}"></i>`;
              var problemText = getI18n(s => s.reportProblem.otherProblem);
              switch (inbox.problemReportType) {
                case "WRONG_LOCATION":
                  problemText = getI18n(s => s.reportProblem.wrongLocation);
                  break;
                case "STATION_INACTIVE":
                  problemText = getI18n(s => s.reportProblem.stationInactive);
                  break;
                case "STATION_NONEXISTENT":
                  problemText = getI18n(
                    s => s.reportProblem.stationNonExistant
                  );
                  break;
                case "WRONG_PHOTO":
                  problemText = getI18n(s => s.reportProblem.wrongPhoto);
                  break;
              }
              problemType = `<p class="card-text">${problemText}</p>`;
              problemSolving = `<p class="card-text"><select class="custom-select" id="problemSolving-${
                inbox.id
              }">
                        <option value="" selected>${getI18n(
                          s => s.inbox.chooseProblemSolving
                        )}</option>
                        <option value="DEACTIVATE_STATION">${getI18n(
                          s => s.inbox.deactivateStation
                        )}</option>
                        <option value="DELETE_STATION">${getI18n(
                          s => s.inbox.deleteStation
                        )}</option>
                        <option value="DELETE_PHOTO">${getI18n(
                          s => s.inbox.deletePhoto
                        )}</option>
                        <option value="MARK_SOLVED">${getI18n(
                          s => s.inbox.markSolved
                        )}</option>
                    </select></p>`;
            }
            var conflictIcon = "";
            var forceImport = "";
            if (problemType === "") {
              if (inbox.hasConflict) {
                forceImport = `<p class="card-text"><input id="forceImport-${
                  inbox.id
                }" name="forceImport-${inbox.id}" type="checkbox"/>
                <label for="forceImport-${inbox.id}">${getI18n(
                  s => s.inbox.ignoreConflict
                )}</label></p>`;
              }
              if (inbox.hasPhoto) {
                forceImport = `<p class="card-text"><input id="forceImport-${
                  inbox.id
                }" name="forceImport-${inbox.id}" type="checkbox"/>
                    <label for="forceImport-${inbox.id}">${getI18n(
                  s => s.inbox.overwriteExistingPhoto
                )}</label></p>`;
              }
              if (inbox.hasConflict || inbox.hasPhoto) {
                conflictIcon = ` <i class="fas fa-exclamation-triangle" title="${getI18n(
                  s => s.inbox.conflict
                )}"></i>`;
              }
            }
            var coords = "";
            var newStation = "";
            if (inbox.stationId === undefined) {
              forceImport = `<p class="card-text"><input id="forceImport-${
                inbox.id
              }" name="forceImport-${inbox.id}" type="checkbox"/>
                  <label for="forceImport-${inbox.id}">${getI18n(
                s => s.inbox.createStation
              )}</label></p>`;
              coords = `<p class="card-text"><small class="text-muted"><a href="http://www.openstreetmap.org/?mlat=${inbox.lat}&mlon=${inbox.lon}&zoom=18&layers=M" target="_blank">${inbox.lat},${inbox.lon}</a></small></p>`;
              newStation = `<p class="card-text">${getI18n(
                s => s.inbox.missingStation
              )}:<br>
                ${createCountriesDropDown(countries, inbox.id)}</p>
                <p class="card-text"><input id="stationId-${inbox.id}" 
                  name="stationId-${inbox.id}" type="text" placeholder="Station ID"/></p>
                <p class="card-text"><input id="ds100-${inbox.id}" 
                  name="ds100-${inbox.id}" type="text" placeholder="DS100"/></p>
                <p class="card-text"><input id="active-${inbox.id}" 
                  name="active-${inbox.id}" type="checkbox" checked="true"/>
                  <label for="active-${inbox.id}"> ${getI18n(
                    s => s.inbox.activeStation
                  )}</label></p>`;
            }
            const detailLink = `station.php?countryCode=${inbox.countryCode}&stationId=${inbox.stationId}`;
            $("#inboxEntries").append(`
<div class="col mb-4" id="inbox-${inbox.id}">            
  <div class="card" style="max-width: 303px;">
    <div class="card-body">
      <h5 class="card-title"><a href="${detailLink}" data-ajax="false">${
              inbox.id
            }: ${
              inbox.title
            }</a>${conflictIcon}${problemIcon}${processedIcon}</h5>
      <p class="card-text">
        ${inbox.photographerNickname}<br>
        ${createdAt.toLocaleString()}
      </p>
      ${problemType}
      ${coords}
      ${comment}
      ${newStation}
      ${problemSolving}
      ${forceImport}
      <p class="card-text">
        <button class="btn btn-success" name="accept-${inbox.id}"
                    onclick="return accept(${inbox.id});" ${acceptDisabled}>${getI18n(
              s => s.inbox.accept
            )} <i class="fas fa-thumbs-up"></i></button>
        <button class="btn btn-danger" name="reject-${inbox.id}"
                    onclick="return reject(${inbox.id});">${getI18n(
              s => s.inbox.reject
            )} <i class="fas fa-thumbs-down"></i></button>
      </p>
    </div>
    ${image}
  </div>
</div>`);
          }
        } else {
          $("#inboxEntries").html(getI18n(s => s.inbox.inboxEmpty));
        }
      }
    });
  });
}

function fetchPublicInbox() {
  "use strict";
  
  $.ajax({
    url: `${getAPIURI()}publicInbox`,
    type: "GET",
    dataType: "json",
    crossDomain: true,
    error: function() {
      $("#inboxEntries").html(
        getI18n(s => s.inbox.errorLoadingPendingUploads)
      );
    },
    success: function(obj) {
      if (Array.isArray(obj) && obj.length > 0) {
        for (let i = 0; i < obj.length; i++) {
          let inbox = obj[i];
          var coords = `<p class="card-text"><small class="text-muted"><a href="http://www.openstreetmap.org/?mlat=${inbox.lat}&mlon=${inbox.lon}&zoom=18&layers=M" target="_blank">${inbox.lat},${inbox.lon}</a></small></p>`;
          var stationKey = getI18n(s => s.inbox.missingStation);
          var detailLink = "#";
          if (inbox.stationId !== undefined) {
            detailLink = `station.php?countryCode=${inbox.countryCode}&stationId=${inbox.stationId}`;
            stationKey = `${inbox.countryCode}: ${inbox.stationId}`;
          }
          $("#inboxEntries").append(`
            <div class="col mb-4" id="inbox-${i}">            
            <div class="card" style="max-width: 303px;">
              <div class="card-body">
                <h5 class="card-title"><a href="${detailLink}" data-ajax="false">${inbox.title}</a></h5>
                <p class="card-text">${stationKey}</p>
                ${coords}
              </div>
            </div>
            </div>`);
        }
      } else {
        $("#inboxEntries").html(getI18n(s => s.inbox.inboxEmpty));
      }
    }
  });
}

function fetchRecentPhotoImports() {
  "use strict";

  const sinceHours = $("#sinceHours").val();
  
  $.ajax({
    url: `${getAPIURI()}recentPhotoImports?sinceHours=${sinceHours}`,
    type: "GET",
    dataType: "json",
    crossDomain: true,
    error: function() {
      $("#inboxEntries").html(
        getI18n(s => s.inbox.errorLoadingRecentImports)
      );
    },
    success: function(obj) {
      if (Array.isArray(obj) && obj.length > 0) {
        var statistic = {};
        $("#recentImports").html(`<p><ul>`);
        for (let i = 0; i < obj.length; i++) {
          let station = obj[i];
          var detailLink = `station.php?countryCode=${station.country}&stationId=${station.idStr}`;
          var stationKey = `${station.country}: ${station.idStr}`;
          var countryCount = statistic[station.photographer + " - " + station.country];
          if (countryCount === undefined) {
            countryCount = 0;
          }
          countryCount++;
          statistic[station.photographer + " - " + station.country] = countryCount;

          $("#recentImports").append(`
            <li>
                <a href="${detailLink}" data-ajax="false">${station.title}</a> 
                - ${stationKey} ${getI18n(s => s.inbox.by)} <a href="photographer.php?photographer=${station.photographer}">${station.photographer}</a>
            </li>`);
        }

        $("#recentImports").append(`</ul></p><p>${getI18n(s => s.inbox.countByPhotographerAndCountry)}:<ul>`);

        for (var key in statistic) {
          $("#recentImports").append(`
            <li>${key}: ${statistic[key]}</li>`);
        }
        $("#recentImports").append(`</ul></p>`);
      } else {
        $("#recentImports").html(getI18n(s => s.inbox.noRecentImports));
      }
    }
  });
}

function changeSinceHours() {
  const sinceHours = $("#sinceHours").val();
  localStorage.setItem("sinceHours", sinceHours);
  fetchRecentPhotoImports();
}

$(document).ready(function() {
  const sinceHours = getIntFromLocalStorage("sinceHours", 10);
  $("#sinceHours").val(sinceHours);

  const userProfile = UserProfile.currentUser();

  if (userProfile.admin === true) {
    fetchAdminInbox(userProfile);
  } else {
    fetchPublicInbox();
  }
  fetchRecentPhotoImports();
});
