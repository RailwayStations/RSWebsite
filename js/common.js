export function getBoolFromLocalStorage(key, defaultVal) {
  const value = localStorage.getItem(key);
  if (value == null) {
    return defaultVal;
  }

  return value === "true";
}

export function fetchCountries(callback) {
  if (sessionStorage.getItem("countries")) {
    callback(JSON.parse(sessionStorage.getItem("countries")));
    return;
  }

  $.getJSON(getAPIURI() + "countries", function(countries) {
    sessionStorage.setItem("countries", JSON.stringify(countries));
    callback(countries);
  });
}

export function getCountryByCode(countryCode, callback) {
  "use strict";

  fetchCountries(function(countries) {
    for (var i = 0; i < countries.length; i++) {
      if (countries[i].code === countryCode) {
        callback(countries[i]);
      }
    }
  });
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

  getCountryByCode(countryCode, function(country) {
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

export function providerApp(countryCode) {
  "use strict";

  getCountryByCode(countryCode, function(country) {
    var providerAppsTable = "";
    $.each(country.providerApps, function(index, providerApp) {
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
      providerAppsTable = "<tr><td>" + window.i18n.common.noApp + "</td></tr>";
    }

    var providerAppsDiv = $("#providerAppsBody");
    providerAppsDiv.html(
      '<table class="table table-striped">' + providerAppsTable + "</table>"
    );

    $("#providerApps").modal("show");
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

  return string === undefined || string.trim().length === 0;
}

export function deleteUserProfile() {
  "use strict";

  localStorage.removeItem("userProfile");
}

export function setUserProfile(userProfile) {
  "use strict";

  localStorage.setItem("userProfile", JSON.stringify(userProfile));
}

export function getUserProfile() {
  "use strict";

  var userProfile = JSON.parse(getStringFromLocalStorage("userProfile", "{}"));
  if (userProfile.email === undefined) {
    userProfile.email = "";
  }
  if (userProfile.password === undefined) {
    if (userProfile.uploadToken !== undefined) {
      userProfile.password = userProfile.uploadToken;
      delete userProfile.uploadToken;
    } else {
      userProfile.password = "";
    }
  }
  if (userProfile.nickname === undefined) {
    userProfile.nickname = "";
  }
  if (userProfile.link === undefined) {
    userProfile.link = "";
  }
  if (userProfile.photoOwner === undefined) {
    userProfile.photoOwner = false;
  }
  if (userProfile.anonymous === undefined) {
    userProfile.anonymous = false;
  }
  if (userProfile.license === undefined) {
    userProfile.license = "";
  }
  userProfile.cc0 = userProfile.license === "CC0";

  return userProfile;
}

export function setCountryCode(countryCode) {
  "use strict";
  localStorage.setItem("countryCode", countryCode);
}

export function getCountryCode() {
  "use strict";
  return getStringFromLocalStorage("countryCode", "de");
}

export function getAPIURI() {
  "use strict";
  return "https://api.railway-stations.org/";
  //return "http://localhost:8080/";
}

/**
 * Uses the Google Image Proxy to return a scaled version of the image
 *
 * @param {string} src The URL to the original image
 * @param {number} width
 * @return {string} The URL to the scaled image
 */
export function scaleImage(src, width) {
  return (
    "https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&resize_w=" +
    width +
    "&url=" +
    encodeURIComponent(src)
  );
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
