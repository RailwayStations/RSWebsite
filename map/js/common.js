/*jslint browser: true*/
/*global $,L*/

//-----------------------------------------------------------------------

function getBoolFromLocalStorage(pre, defaultVal) {
	"use strict";

	var value = localStorage.getItem(pre);

	if (value == null) {
		return defaultVal;
	}

  return localStorage.getItem(pre) == "true" ? true : false;
}

function preventLocalLink() {
	"use strict";

	$(".localLink").click(function(e) {
		e.preventDefault();
		window.location.href = $(this).attr("href");
	});
}

function setCountryCode(countryCode) {
	"use strict";

	localStorage.setItem("countryCode", countryCode);
}

function getCountryCode() {
	"use strict";

	var countryCode = localStorage.getItem("countryCode");
	if (countryCode == null) {
		countryCode = "de";
	}

	return countryCode;
}

function getAPIURI() {
	"use strict";

	return "https://api.railway-stations.org/";
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
	  if (q !== null) {
				q = q.split("&");

	      for (var i = 0; i < q.length; i++) {
	          var hash = q[i].split("=");
	          vars.push(hash[1]);
	          vars[hash[0]] = decodeURIComponent(hash[1]);
	      }
	  }

		return vars;
}