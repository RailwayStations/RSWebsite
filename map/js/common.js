/*jslint browser: true*/
/*global $,L*/

//-----------------------------------------------------------------------

function getBoolFromLocalStorage(key, defaultVal) {
	"use strict";

	var value = localStorage.getItem(key);
	if (value == null) {
		return defaultVal;
	}

  return value == "true" ? true : false;
}

function fetchCountries(callback) {
	"use strict";

	if (sessionStorage.getItem("countries")) {
		callback(JSON.parse(sessionStorage.getItem("countries")));
		return;
	}

	$.getJSON(getAPIURI() + "countries", function (countries) {
		sessionStorage.setItem("countries", JSON.stringify(countries));
		callback(countries);
	});
}

function getCountryByCode(countryCode, callback) {
	"use strict";

	fetchCountries(function(countries) {
		for (var i = 0; i < countries.length; i++) {
			if (countries[i].code == countryCode) {
				callback(countries[i]);
			}
		}
	});
}

function navigate(lat, lon){
	"use strict";

    // If it's an iPhone..
    if( (navigator.platform.indexOf("iPhone") != -1)
        || (navigator.platform.indexOf("iPod") != -1)
        || (navigator.platform.indexOf("iPad") != -1)) {
         window.open("maps://maps.google.com/maps?daddr=" + lat + "," + lon + "&amp;ll=");
    } else {
         window.open("http://maps.google.com/maps?daddr=" + lat + "," + lon + "&amp;ll=");
		}
		return false;
}

function createTimetableUrl(country, stationId, stationTitle, stationDs100) {
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

function timetable(countryCode, stationId, stationTitle, stationDs100) {
	"use strict";

	getCountryByCode(countryCode, function(country) {
		var timetableUrl = createTimetableUrl(country, stationId, stationTitle, stationDs100);
		if (isNotBlank(timetableUrl)) {
			window.open(timetableUrl);
		}
	});
}

function getStringFromLocalStorage(key, defaultVal) {
	"use strict";

	var value = localStorage.getItem(key);

	if (value == null) {
		return defaultVal;
	}

  return value;
}

function isNotBlank(string) {
	"use strict";

  return !isBlank(string);
}

function isBlank(string) {
	"use strict";

  return (string === undefined || string.trim().length == 0);
}

function setUserProfile(userProfile) {
	"use strict";

	localStorage.setItem("userProfile", JSON.stringify(userProfile));
}

function getUserProfile() {
	"use strict";

	var userProfile = JSON.parse(getStringFromLocalStorage("userProfile","{}"));
	if (userProfile.email === undefined) {
		userProfile.email = "";
	}
	if (userProfile.uploadToken === undefined) {
		userProfile.uploadToken = "";
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
	userProfile.cc0 = (userProfile.license == "CC0");

	return userProfile;
}

function setCountryCode(countryCode) {
	"use strict";
	localStorage.setItem("countryCode", countryCode);
}

function getCountryCode() {
	"use strict";
	return getStringFromLocalStorage("countryCode", "de");
}

function getAPIURI() {
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
function scaleImage(src, width) {
	return "https://images1-focus-opensocial.googleusercontent.com/gadgets/proxy?container=focus&resize_w=" + width + "&url=" + encodeURIComponent(src);
}

function getQueryParameter() {
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
