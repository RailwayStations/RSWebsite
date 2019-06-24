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

function getStringFromLocalStorage(key, defaultVal) {
	"use strict";

	var value = localStorage.getItem(key);

	if (value == null) {
		return defaultVal;
	}

  return value;
}

function setResultMessage(message) {
  "use strict";

  document.getElementById('result').innerHTML =
       '<span class="msg">' + message + '<\/span><br/><br/>';
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
