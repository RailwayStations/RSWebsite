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
  updateInboxCount,
  navigate,
  timetable,
  getTileServerUrl,
  initRSAPI
} from "../common";
import "bootstrap";
import { updateMarker } from "./markers";
import { showMissingStationPopup, showPopup } from "./popup";
import { fetchStationDataPromise } from "./stationClient";
import { showHighScorePopup } from "./highscore";
import { getI18n } from "../i18n";
import Fuse from "fuse.js";

window.Spinner = Spinner;
window.navigate = navigate;

let dataBahnhoefe = null,
  map = null,
  markers = null,
  specialMarker = null;

const searchOptions = {
  // isCaseSensitive: false,
  // includeScore: false,
  // shouldSort: true,
  // includeMatches: false,
  findAllMatches: true,
  // minMatchCharLength: 1,
  // location: 0,
  threshold: 0.2,
  distance: 0,
  // useExtendedSearch: false,
  ignoreLocation: true,
  // ignoreFieldNorm: false,
  keys: ["title", "idStr"],
};

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

  const station = dataBahnhoefe.filter(
    station => station.idStr === stationId
  )[0];
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
    markers = updateMarker(dataBahnhoefe, map, specialMarker);
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

function initMap() {
  const queryParameter = getQueryParameter();
  if (queryParameter) {
    if (queryParameter.countryCode && queryParameter.countryCode.length > 0) {
      setCountryCode(queryParameter.countryCode);
    }
    if (queryParameter.mlat && queryParameter.mlon) {
      setLastPos(L.latLng(queryParameter.mlat, queryParameter.mlon));
      let iconUrl = `./images/pointer-grey-question.png`;
      const customIcon = L.icon({
        iconUrl: iconUrl,
        iconSize: [50, 50],
        iconAnchor: [25, 50],
        popupAnchor: [0, -28],
      });
      specialMarker = L.marker([queryParameter.mlat, queryParameter.mlon], {
        icon: customIcon,
      });
    }
    if (queryParameter.zoom) {
      setLastZoomLevel(queryParameter.zoom);
    }
  }

  updateInboxCount();

  const lastPos = getLastPos();
  const mapCenter = !lastPos ? L.latLng(50.9730622, 10.9603269) : lastPos;
  const lastZoomLevel = getLastZoomLevel();
  const mapZoomLevel = !lastZoomLevel ? 6 : lastZoomLevel;

  map = L.map("map").setView(mapCenter, mapZoomLevel);

  L.tileLayer(getTileServerUrl(), {
    maxZoom: 18,
    attribution:
      '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  map.on("contextmenu", function (ev) {
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
        title: getI18n(s => s.index.myLocation),
      },
    })
    .addTo(map);

  fetchStationDataPromise(map)
    .then(data => {
      dataBahnhoefe = data;
      markers = updateMarker(dataBahnhoefe, map, specialMarker);
    })
    .then(function () {
      map.on("zoomend", function () {
        setLastZoomLevel(map.getZoom());
      });
      map.on("moveend", function () {
        setLastPos(map.getCenter());
      });
    })
    .catch(error => {
      console.log(error);
      alert(`error: ${error}`);
    });

  $(window)
    .on("resize", function () {
      $("#map").height($(window).height() - 60);
      map.invalidateSize();
    })
    .trigger("resize");

  $("#suche").autocomplete({
    lookup: function (query, done) {
      const fuse = new Fuse(dataBahnhoefe, searchOptions);
      var filtered = fuse.search(query);
      var result = {
        suggestions: [],
      };
      result.suggestions = $.map(filtered, function (value, key) {
        return {
          value: value.item.title,
          data: value.item.idStr,
        };
      });
      result.suggestions.sort((a, b) => {
        return searchWeight(query, b) - searchWeight(query, a);
      });
      done(result);
    },
    onSelect: function (suggestion) {
      $("#suche").val(suggestion.value);
      var bahnhof = dataBahnhoefe.filter(function (bahnhof) {
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
    },
  });
}

$(document).ready(function () {
  initRSAPI().then(function() {
    initMap()
  });
});
