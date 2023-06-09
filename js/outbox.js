import $ from "jquery";
import {
  getAPIURI,
  fetchCountries,
  isNotBlank,
  getAuthorization,
} from "./common";
import "bootstrap";
import { getI18n } from "./i18n";
import { UserProfile } from "./settings/UserProfile";

window.$ = $;

function fetchUserOutbox() {
  "use strict";

  $.ajax({
    url: `${getAPIURI()}userInbox`,
    type: "GET",
    dataType: "json",
    crossDomain: true,
    headers: {
      Authorization: getAuthorization(),
    },
    error: function (xhr, textStatus, errorThrown) {
      if (xhr.status == 401) {
        window.location.href =
          "settings.php?error=" +
          encodeURIComponent(getI18n(s => s.settings.pleaseLogIn));
      } else {
        $("#outboxEntries").html(
          getI18n(s => s.outbox.errorLoadingOutbox) + ": " + textStatus
        );
      }
    },
    success: function (obj) {
      if (Array.isArray(obj) && obj.length > 0) {
        for (let i = 0; i < obj.length; i++) {
          let inbox = obj[i];
          var createdAt = new Date(0); // The 0 there is the key, which sets the date to the epoch
          createdAt.setUTCSeconds(inbox.createdAt / 1000);
          var image = "";
          if (isNotBlank(inbox.filename)) {
            image = `<a href="${inbox.inboxUrl}" data-ajax="false" target="_blank">
                       <img src="${inbox.inboxUrl}?width=301" loading="lazy" class="card-img-top" alt="${inbox.title}">
                       </a>`;
          }
          var comment = "";
          if (inbox.comment !== undefined) {
            comment = `<p class="card-text"><small class="text-muted">${inbox.comment}</small></p>`;
          }
          var coords = "";
          var problemIcon = "";
          var problemType = "";
          if (inbox.problemReportType !== undefined) {
            problemIcon = ` <i class="fas fa-bullhorn" title="${getI18n(
              s => s.inbox.problemReport
            )}"></i>`;
            var problemText = getI18n(s => s.reportProblem.otherProblem);
            switch (inbox.problemReportType) {
              case "WRONG_LOCATION":
                problemText = getI18n(s => s.reportProblem.wrongLocation);
                coords = `<p class="card-text"><small class="text-muted"><a href="index.php?countryCode=${inbox.countryCode}&mlat=${inbox.lat}&mlon=${inbox.lon}&zoom=18&layers=M" target="_blank">${inbox.lat},${inbox.lon}</a> -> <a href="index.php?countryCode=${inbox.countryCode}&mlat=${inbox.newLat}&mlon=${inbox.newLon}&zoom=18&layers=M" target="_blank">${inbox.newLat},${inbox.newLon}</a></small></p>`;
                break;
              case "WRONG_NAME":
                problemText = `${getI18n(
                  s => s.reportProblem.wrongName
                )}: <em>${inbox.newTitle}</em>`;
                break;
              case "STATION_INACTIVE":
                problemText = getI18n(s => s.reportProblem.stationInactive);
                break;
              case "STATION_ACTIVE":
                problemText = getI18n(s => s.reportProblem.stationActive);
                break;
              case "STATION_NONEXISTENT":
                problemText = getI18n(s => s.reportProblem.stationNonExistant);
                break;
              case "WRONG_PHOTO":
                problemText = getI18n(s => s.reportProblem.wrongPhoto);
                break;
              case "PHOTO_OUTDATED":
                problemText = getI18n(s => s.reportProblem.photoOutdated);
                break;
            }
            problemType = `<p class="card-text">${problemText}</p>`;
          }
          var conflictIcon = "";
          if (inbox.hasConflict) {
            conflictIcon = ` <i class="fas fa-exclamation-triangle" title="${getI18n(
              s => s.inbox.conflict
            )}"></i>`;
          }

          var stateText = getI18n(s => s.outbox.stateUnkown);
          switch (inbox.state) {
            case "REVIEW":
              stateText = getI18n(s => s.outbox.stateReview);
              break;
            case "CONFLICT":
              stateText = getI18n(s => s.outbox.stateConflict);
              break;
            case "ACCEPTED":
              stateText = getI18n(s => s.outbox.stateAccepted);
              break;
            case "REJECTED":
              stateText = getI18n(s => s.outbox.stateRejected);
              break;
          }
          var state = `<p class="card-text">${getI18n(
            s => s.outbox.stateLabel
          )}${stateText}</p>`;

          var rejectedReason = "";
          if (inbox.rejectedReason !== undefined) {
            rejectedReason = `<p class="card-text"><small class="text-muted">${inbox.rejectedReason}</small></p>`;
          }

          var stationTitle = inbox.title;
          var stationLat = inbox.lat;
          var stationLon = inbox.lon;

          if (inbox.stationId === undefined) {
            stationTitle = inbox.newTitle;
            stationLat = inbox.newLat;
            stationLon = inbox.newLon;
            coords = `<p class="card-text"><small class="text-muted"><a href="index.php?countryCode=${inbox.countryCode}&mlat=${stationLat}&mlon=${stationLon}&zoom=18&layers=M" target="_blank">${stationLat},${stationLon}</a></small></p>`;
          }
          var title = `${inbox.id}: ${stationTitle}`;
          if (inbox.stationId !== undefined) {
            title = `<a href="station.php?countryCode=${inbox.countryCode}&stationId=${inbox.stationId}" data-ajax="false">${title}</a>`;
          }
          $("#outboxEntries").append(`
<div class="col mb-4" id="inbox-${inbox.id}">            
  <div class="card" style="max-width: 303px;">
    <div class="card-body">
      <h5 class="card-title">${title}${conflictIcon}${problemIcon}</h5>
      <p class="card-text">
        ${createdAt.toLocaleString()}
      </p>
      ${problemType}
      ${coords}
      ${comment}
      ${state}
      ${rejectedReason}
    </div>
    ${image}
  </div>
</div>`);
        }
      } else {
        $("#outboxEntries").html(getI18n(s => s.outbox.outboxEmpty));
      }
    },
  });
}

function initOutbox() {
  if (!UserProfile.isLoggedIn()) {
    window.location.href =
      "settings.php?error=" +
      encodeURIComponent(getI18n(s => s.settings.pleaseLogIn));
    return;
  }

  fetchUserOutbox();
}

$(function () {
  initOutbox();
});
