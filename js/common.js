import $ from "jquery";
import "bootstrap";
import { getI18n } from "./i18n";
import { CountryClient } from "./countriesClient";
import { UserProfile } from "./settings/UserProfile";
import { Modal } from "bootstrap";

export function getBoolFromLocalStorage(key, defaultVal) {
  const value = localStorage.getItem(key);
  if (value == null) {
    return defaultVal;
  }

  return value === "true";
}

export function getIntFromLocalStorage(key, defaultVal) {
  const value = localStorage.getItem(key);
  if (value == null) {
    return defaultVal;
  }
  const parsed = parseInt(value);
  if (isNaN(parsed)) {
    return defaultVal;
  }

  return parsed;
}

export function fetchCountries() {
  return CountryClient.getPromise();
}

export function getCountryByCode(countryCode) {
  return fetchCountries().then(countries =>
    countries.find(country => country.code === countryCode)
  );
}

export function navigate(lat, lon) {
  "use strict";

  // If it's an iPhone..
  if (
    navigator.platform.indexOf("iPhone") !== -1 ||
    navigator.platform.indexOf("iPod") !== -1 ||
    navigator.platform.indexOf("iPad") !== -1
  ) {
    window.open(
      "maps://maps.google.com/maps?daddr=" + lat + "," + lon + "&amp;ll="
    );
  } else {
    window.open(
      "http://maps.google.com/maps?daddr=" + lat + "," + lon + "&amp;ll="
    );
  }
  return false;
}

export function createTimetableUrl(
  country,
  stationId,
  stationTitle,
  stationDs100
) {
  "use strict";

  var timeTableTemplate = country.timetableUrlTemplate;
  if (isBlank(timeTableTemplate)) {
    return null;
  }

  timeTableTemplate = timeTableTemplate.replace("{id}", stationId);
  timeTableTemplate = timeTableTemplate.replace("{title}", stationTitle);
  timeTableTemplate = timeTableTemplate.replace("{DS100}", stationDs100);

  return timeTableTemplate;
}

export function timetable(countryCode, stationId, stationTitle, stationDs100) {
  "use strict";

  getCountryByCode(countryCode).then(country => {
    var timetableUrl = createTimetableUrl(
      country,
      stationId,
      stationTitle,
      stationDs100
    );
    if (isNotBlank(timetableUrl)) {
      window.open(timetableUrl);
    }
  });
}

export function updateInboxCount() {
  "use strict";

  const userProfile = UserProfile.currentUser();
  if (userProfile.admin === true) {
    $.ajax({
      url: `${getAPIURI()}adminInboxCount`,
      type: "GET",
      dataType: "json",
      crossDomain: true,
      headers: {
        Authorization: getAuthorization(),
      },
      success: function (obj) {
        if (obj.pendingInboxEntries > 0) {
          $("#nav_inbox").append(
            `<span class="badge bg-light text-dark">${obj.pendingInboxEntries}</span>`
          );
        }
      },
    });
  } else {
    $.ajax({
      url: `${getAPIURI()}publicInbox`,
      type: "GET",
      dataType: "json",
      crossDomain: true,
      success: function (obj) {
        $("#nav_inbox").append(
          `<span class="badge bg-light text-dark">${obj.length}</span>`
        );
      },
    });
  }
}

export function providerApp(countryCode) {
  "use strict";

  getCountryByCode(countryCode).then(country => {
    var providerAppsTable = "";
    $.each(country.providerApps, function (index, providerApp) {
      var icon = "fas fa-external-link-alt";
      if (providerApp.type === "android") {
        icon = "fab fa-android";
      } else if (providerApp.type === "ios") {
        icon = "fab fa-apple";
      }

      providerAppsTable =
        providerAppsTable +
        '<tr><td><a data-ajax="false" href="' +
        providerApp.url +
        '"><i class="' +
        icon +
        '"> ' +
        providerApp.name +
        "</i></a></td></tr>";
    });

    if (providerAppsTable === "") {
      providerAppsTable =
        "<tr><td>" + getI18n(s => s.common.noApp) + "</td></tr>";
    }

    var providerAppsDiv = $("#providerAppsBody");
    providerAppsDiv.html(
      '<table class="table table-striped">' + providerAppsTable + "</table>"
    );

    let appsModal = new Modal(document.getElementById("providerApps"));
    appsModal.show();
  });
}

export function getStringFromLocalStorage(key, defaultVal) {
  "use strict";

  var value = localStorage.getItem(key);

  if (value == null) {
    return defaultVal;
  }

  return value;
}

export function isNotBlank(string) {
  "use strict";

  return !isBlank(string);
}

export function isBlank(string) {
  "use strict";

  return string === undefined || string === null || string.trim().length === 0;
}

export function setCountryCode(countryCode) {
  "use strict";
  localStorage.setItem("countryCode", countryCode);
}

export function getCountryCode() {
  "use strict";
  return getStringFromLocalStorage("countryCode", "de");
}

export function getAccessToken() {
  "use strict";
  return localStorage.getItem("access_token");
}

export function getAuthorization() {
  "use strict";
  return "Bearer " + getAccessToken();
}

export function getAPIURI() {
  "use strict";
  let apiUrl = process.env.API_URL;
  console.log(apiUrl);
  return apiUrl;
}

const tileServerMap = {
  OpenStreetMap: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  "DBS OSM Railway":
    "https://osm-prod.noncd.db.de:8100/styles/dbs-osm-railway/{z}/{x}/{y}.png?key=ias7AMiTHZCJo2PB9v6gDvlSdH9nMgYv",
  "DBS OSM Basic":
    "https://osm-prod.noncd.db.de:8100/styles/dbs-osm-basic/{z}/{x}/{y}.png?key=ias7AMiTHZCJo2PB9v6gDvlSdH9nMgYv",
};

export function getTileServerMap() {
  "use strict";

  return tileServerMap;
}

export function getTileServerUrl() {
  "use strict";

  return tileServerMap[getTileServer()];
}

export function getTileServer() {
  "use strict";

  return getStringFromLocalStorage("tileServer", "OpenStreetMap");
}

export function setTileServer(tileServer) {
  "use strict";

  localStorage.setItem("tileServer", tileServer);
}

export function getPhotoFilter() {
  "use strict";

  return getStringFromLocalStorage("photoFilter", "photoFilterAll");
}

export function setPhotoFilter(photoFilter) {
  "use strict";

  localStorage.setItem("photoFilter", photoFilter);
}

export function getActiveFilter() {
  "use strict";

  return getStringFromLocalStorage("activeFilter", "activeFilterAll");
}

export function setActiveFilter(activeFilter) {
  "use strict";

  localStorage.setItem("activeFilter", activeFilter);
}

/**
 * Uses the Google Image Proxy to return a scaled version of the image
 *
 * @param {string} src The URL to the original image
 * @param {number} width
 * @return {string} The URL to the scaled image
 */
export function scaleImage(src, width) {
  return src + "?width=" + width;
}

export function getQueryParameter() {
  "use strict";
  var vars = [];
  var q = document.URL.split("?")[1];
  if (q && q !== null) {
    q = q.split("&");

    for (var i = 0; i < q.length; i++) {
      var hash = q[i].split("=");
      vars.push(hash[1]);
      vars[hash[0]] = decodeURIComponent(hash[1]);
    }
  }

  return vars;
}
