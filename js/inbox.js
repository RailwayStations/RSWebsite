import $ from "jquery";
import {
  getAPIURI,
  fetchCountries,
  isNotBlank,
  getIntFromLocalStorage,
  getAuthorization,
} from "./common";
import "bootstrap";
import { getI18n } from "./i18n";
import { UserProfile } from "./settings/UserProfile";

window.$ = $;
window.accept = accept;
window.reject = reject;
window.nextZ = nextZ;
window.changeSinceHours = changeSinceHours;
window.changeProblemSolving = changeProblemSolving;

function sendInboxCommand(inboxCommand) {
  "use strict";

  console.log(inboxCommand);

  var request = $.ajax({
    url: getAPIURI() + "adminInbox",
    contentType: "application/json; charset=utf-8",
    type: "POST",
    dataType: "json",
    processData: false,
    headers: {
      Authorization: getAuthorization(),
    },
    data: JSON.stringify(inboxCommand),
  });

  request.done(function (data) {
    $("#buttons-" + inboxCommand.id).attr("style", "visibility: collapse");
    var alertPlaceholder = document.getElementById(
      "liveAlertPlaceholder-" + inboxCommand.id
    );
    var wrapper = document.createElement("div");
    wrapper.innerHTML =
      '<div class="alert alert-success alert-dismissible" role="alert">Done</div>';
    alertPlaceholder.append(wrapper);
    fetchRecentPhotoImports();
  });

  request.fail(function (jqXHR, textStatus, errorThrown) {
    if (jqXHR.responseText) {
      var response = JSON.parse(jqXHR.responseText);
      alert(response.status + ": " + response.message);
    } else {
      alert(textStatus + ": " + errorThrown);
    }
  });
}

function nextZ(id) {
  "use strict";

  $.ajax({
    url: `${getAPIURI()}nextZ`,
    type: "GET",
    dataType: "json",
    crossDomain: true,
    error: function () {
      $("#stationId-" + id).val("error");
    },
    success: function (obj) {
      $("#stationId-" + id).val(obj.nextZ);
    },
  });
}

function changeProblemSolving(id) {
  "use strict";

  var problemSolving = $("#problemSolving-" + id).val();
  if (problemSolving == "CHANGE_NAME") {
    $("#title-p-" + id).show();
  } else {
    $("#title-p-" + id).hide();
  }

  if (problemSolving == "UPDATE_LOCATION") {
    $("#lat-p-" + id).show();
    $("#lon-p-" + id).show();
  } else {
    $("#lat-p-" + id).hide();
    $("#lon-p-" + id).hide();
  }
}

function accept(id) {
  "use strict";

  var conflictResolution = $("#conflictResolution-" + id).val();
  var countryCode = $("#country-" + id).val();
  var stationId = $("#stationId-" + id).val();
  var command = "IMPORT_PHOTO";
  if (isNotBlank(stationId)) {
    command = "IMPORT_MISSING_STATION";
  }
  var title = $("#title-" + id).val();
  var lat = $("#lat-" + id).val();
  var lon = $("#lon-" + id).val();
  var ds100 = $("#ds100-" + id).val();
  var active = $("#active-" + id).val();
  var problemSolving = $("#problemSolving-" + id).val();
  if (problemSolving !== undefined) {
    if (problemSolving === "") {
      alert(getI18n(s => s.inbox.chooseProblemSolving));
      return;
    }
    command = problemSolving;
  } else if (active === "") {
    alert(getI18n(s => s.upload.pleaseSelectActiveFlag));
    return;
  }

  var inboxCommand = {
    id: id,
    countryCode: countryCode,
    stationId: stationId,
    title: title,
    lat: lat,
    lon: lon,
    command: command,
    conflictResolution: conflictResolution,
    DS100: ds100,
    active: active,
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

function createCountriesDropDown(countries, countryCode, id) {
  "use strict";

  let countryOptions = `<select class="form-control" id="country-${id}">
    <option value="">${getI18n(s => s.inbox.selectCountry)}</option>`;

  countries.forEach(country => {
    var selected = "";
    if (country.code === countryCode) {
      selected = "selected";
    }
    countryOptions += `<option value="${country.code}" ${selected}>${country.name}</option>`;
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
        Authorization: getAuthorization(),
      },
      error: function () {
        $("#inboxEntries").html(
          getI18n(s => s.inbox.errorLoadingPendingUploads)
        );
      },
      success: function (obj) {
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
                       <img src="${inbox.inboxUrl}?width=301" loading="lazy" class="card-img-top" alt="${inbox.title}">
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
                case "STATION_ACTIVE":
                  problemText = getI18n(s => s.reportProblem.stationActive);
                  break;
                case "STATION_NONEXISTENT":
                  problemText = getI18n(
                    s => s.reportProblem.stationNonExistant
                  );
                  break;
                case "WRONG_PHOTO":
                  problemText = getI18n(s => s.reportProblem.wrongPhoto);
                  break;
                case "PHOTO_OUTDATED":
                  problemText = getI18n(s => s.reportProblem.photoOutdated);
                  break;
              }
              problemType = `<p class="card-text">${problemText}</p>`;
              problemSolving = `<p class="card-text"><select class="custom-select" 
                            onchange="changeProblemSolving(${
                              inbox.id
                            })" id="problemSolving-${inbox.id}">
                        <option value="" selected>${getI18n(
                          s => s.inbox.chooseProblemSolving
                        )}</option>
                        <option value="ACTIVATE_STATION">${getI18n(
                          s => s.inbox.activateStation
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
                        <option value="CHANGE_NAME">${getI18n(
                          s => s.inbox.changeName
                        )}</option>
                        <option value="UPDATE_LOCATION">${getI18n(
                          s => s.inbox.updateLocation
                        )}</option>
                        <option value="PHOTO_OUTDATED">${getI18n(
                          s => s.inbox.photoOutdated
                        )}</option>
                    </select></p>
                    <p class="card-text" style="display: none" id="title-p-${
                      inbox.id
                    }"><input id="title-${inbox.id}" class="form-control" 
                    name="title-${
                      inbox.id
                    }" type="text" placeholder="Title" value="${
                inbox.title
              }"/></p>
                    <p class="card-text" style="display: none" id="lat-p-${
                      inbox.id
                    }"><input id="lat-${inbox.id}" class="form-control"  
                      name="lat-${
                        inbox.id
                      }" type="text" placeholder="Latitude" value="${
                inbox.lat
              }"/></p>
                    <p class="card-text" style="display: none" id="lon-p-${
                      inbox.id
                    }"><input id="lon-${inbox.id}" class="form-control"  
                      name="lon-${
                        inbox.id
                      }" type="text" placeholder="Longitude" value="${
                inbox.lon
              }"/></p>
                      `;
            }
            var conflictIcon = "";
            var conflictResolution = "";
            if (problemType === "") {
              if (inbox.hasConflict) {
                conflictResolution = `<option value="IMPORT_AS_NEW_PRIMARY_PHOTO">${getI18n(
                  s => s.inbox.importAsNewPrimaryPhoto
                )}</option>`;
              }
              if (inbox.hasPhoto) {
                conflictResolution = `<option value="IMPORT_AS_NEW_PRIMARY_PHOTO">${getI18n(
                  s => s.inbox.importAsNewPrimaryPhoto
                )}</option>`;
                conflictResolution += `<option value="IMPORT_AS_NEW_SECONDARY_PHOTO">${getI18n(
                  s => s.inbox.importAsNewSecondaryPhoto
                )}</option>`;
                conflictResolution += `<option value="OVERWRITE_EXISTING_PHOTO">${getI18n(
                  s => s.inbox.overwriteExistingPhoto
                )}</option>`;
              }
            }

            var coords = "";
            var newStation = "";
            if (inbox.stationId === undefined) {
              if (inbox.hasConflict) {
                conflictResolution = `<option value="IGNORE_NEARBY_STATION">${getI18n(
                  s => s.inbox.ignoreNearbyStation
                )}</option>`;
              }
              var active_undefined = "";
              var active_true = "";
              var active_false = "";
              if (inbox.active === undefined) {
                active_undefined = `selected`;
              } else if (inbox.active) {
                active_true = `selected`;
              } else {
                active_false = `selected`;
              }
              coords = `<p class="card-text"><small class="text-muted"><a href="index.php?mlat=${inbox.lat}&mlon=${inbox.lon}&zoom=18&layers=M" target="_blank">${inbox.lat},${inbox.lon}</a></small></p>`;
              newStation = `<p class="card-text">${createCountriesDropDown(
                countries,
                inbox.countryCode,
                inbox.id
              )}</p>
                <p class="card-text">
                  <div class="input-group mb-2 me-sm-2">
                    <div class="input-group-prepend">
                      <div class="input-group-text" onclick="return nextZ(${
                        inbox.id
                      })" style="cursor: pointer;">Z</div>
                    </div>
                    <input id="stationId-${inbox.id}" class="form-control" 
                      name="stationId-${
                        inbox.id
                      }" type="text" placeholder="Station ID"/>
                  </div>
                </p>
                <p class="card-text"><input id="title-${
                  inbox.id
                }" class="form-control" 
                  name="title-${
                    inbox.id
                  }" type="text" placeholder="Title" value="${
                inbox.title
              }"/></p>
                <p class="card-text"><input id="lat-${
                  inbox.id
                }" class="form-control"  
                  name="lat-${
                    inbox.id
                  }" type="text" placeholder="Latitude" value="${
                inbox.lat
              }"/></p>
                <p class="card-text"><input id="lon-${
                  inbox.id
                }" class="form-control"  
                  name="lon-${
                    inbox.id
                  }" type="text" placeholder="Longitude" value="${
                inbox.lon
              }"/></p>
                <p class="card-text"><input id="ds100-${
                  inbox.id
                }" class="form-control"  
                  name="ds100-${inbox.id}" type="text" placeholder="DS100"/></p>
                <p class="card-text" id="active-p-${
                  inbox.id
                }"><select class="form-control" id="active-${
                inbox.id
              }" name="active-${inbox.id}">
                    <option value="" ${active_undefined}>${getI18n(
                s => s.upload.pleaseSelectActiveFlag
              )}</option>
                    <option value="true" ${active_true}>${getI18n(
                s => s.inbox.activeStation
              )}</option>
                    <option value="false" ${active_false}>${getI18n(
                s => s.inbox.inactiveStation
              )}</option>
                  </select></p>`;
            }
            var title = `${inbox.id}: ${inbox.title}`;
            if (inbox.stationId !== undefined) {
              title = `<a href="station.php?countryCode=${inbox.countryCode}&stationId=${inbox.stationId}" data-ajax="false">${title}</a>`;
            }
            if (conflictResolution !== "") {
              conflictResolution = `<p class="card-text"><select class="custom-select" id="conflictResolution-${
                inbox.id
              }">
                <option value="DO_NOTHING">${getI18n(
                  s => s.inbox.chooseConflictResolution
                )}</option>
                ${conflictResolution}
                </select></p>`;
            }
            $("#inboxEntries").append(`
<div class="col mb-4" id="inbox-${inbox.id}">            
  <div class="card" style="max-width: 303px;">
    <div class="card-body">
      <h5 class="card-title">${title}${conflictIcon}${problemIcon}${processedIcon}</h5>
      <p class="card-text">
        ${inbox.photographerNickname} <a href="mailto:${
              inbox.photographerEmail
            }?subject=${inbox.title}"><i class="fas fa-envelope"></i></a><br>
        ${createdAt.toLocaleString()}
      </p>
      ${problemType}
      ${coords}
      ${comment}
      ${newStation}
      ${problemSolving}
      ${conflictResolution}
      <p class="card-text" id="buttons-${inbox.id}">
        <button class="btn btn-success" name="accept-${inbox.id}"
                    onclick="return accept(${
                      inbox.id
                    });" ${acceptDisabled}>${getI18n(
              s => s.inbox.accept
            )} <i class="fas fa-thumbs-up"></i></button>
        <button class="btn btn-danger" name="reject-${inbox.id}"
                    onclick="return reject(${inbox.id});">${getI18n(
              s => s.inbox.reject
            )} <i class="fas fa-thumbs-down"></i></button>
      </p>
      <div id="liveAlertPlaceholder-${inbox.id}"></div>
    </div>
    ${image}
  </div>
</div>`);
          }
        } else {
          $("#inboxEntries").html(getI18n(s => s.inbox.inboxEmpty));
        }
      },
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
    error: function () {
      $("#inboxEntries").html(getI18n(s => s.inbox.errorLoadingPendingUploads));
    },
    success: function (obj) {
      if (Array.isArray(obj) && obj.length > 0) {
        for (let i = 0; i < obj.length; i++) {
          let inbox = obj[i];
          var countryCode = "";
          if (inbox.countryCode !== undefined) {
            countryCode = inbox.countryCode;
          }
          var coords = `<p class="card-text"><small class="text-muted"><a href="index.php?countryCode=${countryCode}&mlat=${inbox.lat}&mlon=${inbox.lon}&zoom=18&layers=M" target="_blank">${inbox.lat},${inbox.lon}</a></small></p>`;
          var stationKey = getI18n(s => s.inbox.missingStation);
          var title = inbox.title;
          if (inbox.stationId !== undefined) {
            title = `<a href="station.php?countryCode=${inbox.countryCode}&stationId=${inbox.stationId}" data-ajax="false">${inbox.title}</a>`;
            stationKey = `${inbox.countryCode}: ${inbox.stationId}`;
          }
          $("#inboxEntries").append(`
            <div class="col mb-4" id="inbox-${i}">            
            <div class="card" style="max-width: 303px;">
              <div class="card-body">
                <h5 class="card-title">${title}</h5>
                <p class="card-text">${stationKey}</p>
                ${coords}
              </div>
            </div>
            </div>`);
        }
      } else {
        $("#inboxEntries").html(getI18n(s => s.inbox.inboxEmpty));
      }
    },
  });
}

function fetchRecentPhotoImports() {
  "use strict";

  const sinceHours = $("#sinceHours").val();

  $.ajax({
    url: `${getAPIURI()}photoStationsByRecentPhotoImports?sinceHours=${sinceHours}`,
    type: "GET",
    dataType: "json",
    crossDomain: true,
    error: function () {
      $("#inboxEntries").html(getI18n(s => s.inbox.errorLoadingRecentImports));
    },
    success: function (photoStations) {
      var statistic = {};
      $("#recentImports").html(`<p><ul>`);
      if (photoStations.stations.length > 0) {
        for (let i = 0; i < photoStations.stations.length; i++) {
          let station = photoStations.stations[i];
          for (let p = 0; p < station.photos.length; p++) {
            let photo = station.photos[p];
            var detailLink = `station.php?countryCode=${station.country}&stationId=${station.id}&photoId=${photo.id}`;
            var stationKey = `${station.country}: ${station.id}`;
            var countryCount =
              statistic[photo.photographer + " - " + station.country];
            if (countryCount === undefined) {
              countryCount = 0;
            }
            countryCount++;
            statistic[photo.photographer + " - " + station.country] =
              countryCount;

            $("#recentImports").append(`
              <li>
                  <a href="${detailLink}" data-ajax="false">${
              station.title
            }</a> 
                  - ${stationKey} ${getI18n(
              s => s.inbox.by
            )} <a href="photographer.php?photographer=${photo.photographer}">${
              photo.photographer
            }</a>
              </li>`);
          }
        }

        $("#recentImports").append(
          `</ul></p><p>${getI18n(
            s => s.inbox.countByPhotographerAndCountry
          )}:<ul>`
        );

        for (var key in statistic) {
          $("#recentImports").append(`<li>${key}: ${statistic[key]}</li>`);
        }
        $("#recentImports").append(`</ul></p>`);
      } else {
        $("#recentImports").html(getI18n(s => s.inbox.noRecentImports));
      }
    },
  });
}

function changeSinceHours() {
  const sinceHours = $("#sinceHours").val();
  localStorage.setItem("sinceHours", sinceHours);
  fetchRecentPhotoImports();
}

function initInbox() {
  const sinceHours = getIntFromLocalStorage("sinceHours", 10);
  $("#sinceHours").val(sinceHours);

  const userProfile = UserProfile.currentUser();

  if (userProfile.admin === true) {
    fetchAdminInbox(userProfile);
  } else {
    fetchPublicInbox();
  }
  fetchRecentPhotoImports();
}

$(function () {
  initInbox();
});
