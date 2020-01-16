import "../../css/map/map.css";
import "whatwg-fetch";

import $ from "jquery";
import "leaflet";
import "leaflet.markercluster";
import { Spinner } from "spin.js";
import "leaflet-spin/leaflet.spin";
import "leaflet-easybutton";
import "leaflet.locatecontrol";
import "jQuery-Autocomplete";
import {
  getQueryParameter,
  getCountryCode,
  setCountryCode,
  navigate,
  timetable
} from "../common";
import "bootstrap";
import { updateMarker } from "./markers";
import { showMissingStationPopup, showPopup } from "./popup";
import { fetchStationDataPromise } from "./stationClient";
import { showHighScorePopup } from "./highscore";
import { getI18n } from "../i18n";

window.$ = $;
window.Spinner = Spinner;
window.navigate = navigate;

let dataBahnhoefe = null,
  map = null,
  markers = null,
  ownMarker = null;

function setLastZoomLevel(zoomLevel) {
  "use strict";
  if (zoomLevel != null) {
    sessionStorage.setItem("zoomLevel", zoomLevel);
  } else {
    sessionStorage.removeItem("zoomLevel");
  }
}

export function getLastZoomLevel() {
  "use strict";
  return sessionStorage.getItem("zoomLevel");
}

export function setLastPos(lastPos) {
  "use strict";
  if (lastPos != null) {
    sessionStorage.setItem("lastPosLat", lastPos.lat);
    sessionStorage.setItem("lastPosLng", lastPos.lng);
  } else {
    sessionStorage.removeItem("lastPosLat");
    sessionStorage.removeItem("lastPosLng");
  }
}

export function getLastPos() {
  "use strict";
  const lat = sessionStorage.getItem("lastPosLat");
  const lng = sessionStorage.getItem("lastPosLng");
  if (lat != null && lng != null) {
    return L.latLng(lat, lng);
  }
  return null;
}

export function timetableByStation(stationId) {
  "use strict";

  const station = dataBahnhoefe.filter(station => station.idStr === stationId);
  timetable(station.country, station.idStr, station.title, station.DS100);
}

export function switchCountryLink(countryCode) {
  "use strict";
  const oldCountryCode = getCountryCode();
  localStorage.removeItem(`stations-${oldCountryCode}`);
  setCountryCode(countryCode);

  $("#details").hide();
  $("#karte").show();
  $(".header .mobile-menu:visible .ui-link").click();

  fetchStationDataPromise(map).then(data => {
    dataBahnhoefe = data;

    setLastZoomLevel(null);
    setLastPos(null);
    markers = updateMarker(dataBahnhoefe, map);
  });
}

export function showHighScore(selectedCountryCode) {
  "use strict";

  return showHighScorePopup(selectedCountryCode);
}

function searchWeight(query, suggestion) {
  "use strict";

  var weight = 0;

  if (suggestion.data === query) {
    weight = 3;
  } else if (suggestion.value.toLowerCase() === query.toLowerCase()) {
    weight = 2;
  } else if (suggestion.value.toLowerCase().startsWith(query.toLowerCase())) {
    weight = 1;
  }

  return weight;
}

$(document).ready(function() {
  const queryParameter = getQueryParameter();
  if (
    queryParameter &&
    queryParameter.countryCode &&
    queryParameter.countryCode.length > 0
  ) {
    setCountryCode(queryParameter.countryCode);
  }

  const lastPos = getLastPos();
  const mapCenter = !lastPos ? L.latLng(50.9730622, 10.9603269) : lastPos;
  const lastZoomLevel = getLastZoomLevel();
  const mapZoomLevel = !lastZoomLevel ? 6 : lastZoomLevel;

  map = L.map("map").setView(mapCenter, mapZoomLevel);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution:
      '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  map.on("contextmenu", function(ev) {
    showMissingStationPopup(ev, map);
  });

  const fitMarkers = () => map.fitBounds(markers.getBounds());
  L.easyButton(
    "fa-globe-europe",
    fitMarkers,
    getI18n(s => s.index.showAll)
  ).addTo(map);
  L.control
    .locate({
      showPopup: false,
      strings: {
        title: getI18n(s => s.index.myLocation)
      }
    })
    .addTo(map);

  fetchStationDataPromise(map)
    .then(data => {
      dataBahnhoefe = data;
      markers = updateMarker(dataBahnhoefe, map);
    })
    .then(function() {
      map.on("zoomend", function() {
        setLastZoomLevel(map.getZoom());
      });
      map.on("moveend", function() {
        setLastPos(map.getCenter());
      });
    })
    .catch(error => {
      console.log(error);
      alert(`error: ${error}`);
    });

  $(window)
    .on("resize", function() {
      $("#map").height($(window).height() - 60);
      map.invalidateSize();
    })
    .trigger("resize");

  $("#suche").autocomplete({
    lookup: function(query, done) {
      var matcher = new RegExp(query, "i");
      var filtered = dataBahnhoefe.filter(function(bahnhof) {
        return matcher.test(bahnhof.title) || bahnhof.idStr === query;
      });
      var result = {
        suggestions: []
      };
      result.suggestions = $.map(filtered, function(value, key) {
        return {
          value: value.title,
          data: value.idStr
        };
      });
      result.suggestions.sort((a, b) => {
        return searchWeight(query, b) - searchWeight(query, a);
      });
      done(result);
    },
    onSelect: function(suggestion) {
      $("#suche").val(suggestion.value);
      var bahnhof = dataBahnhoefe.filter(function(bahnhof) {
        return bahnhof.idStr === suggestion.data;
      });
      map.panTo(L.latLng(bahnhof[0].lat, bahnhof[0].lon), 14);

      let bahnhofMarkers = markers.getLayers();
      if (!bahnhofMarkers[0].options) {
        bahnhofMarkers = bahnhofMarkers[0].getLayers();
      }
      bahnhofMarkers.forEach(marker => {
        const markerID = marker.options.properties.idStr;
        if (markerID === suggestion.data) {
          showPopup(marker.options, map);
        }
      });
      return false;
    }
  });
});
