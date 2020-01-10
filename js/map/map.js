import "../../css/map.css";
import "whatwg-fetch";

import $ from "jquery";
import "leaflet";
import "leaflet.markercluster";
import { Spinner } from "spin.js";
import "leaflet-spin/leaflet.spin";
import "jQuery-Autocomplete";
import {
  getQueryParameter,
  getCountryCode,
  getUserProfile,
  fetchCountries,
  getAPIURI,
  getBoolFromLocalStorage,
  setCountryCode,
  getCountryByCode,
  navigate,
  timetable
} from "../common";
import "bootstrap";
import { getI18nStrings } from "../i18n";
import { stationHtml } from "./station";

window.$ = $;
window.Spinner = Spinner;
window.navigate = navigate;

let dataBahnhoefe = null,
  map = null,
  markers = null,
  ownMarker = null,
  popup = null,
  nickname = "",
  watchLocation = false,
  setzoomlevel = false;

export function toggleLocation() {
  "use strict";

  if (watchLocation) {
    map.stopLocate();
    watchLocation = false;
    $("#location_watch_toggle").removeClass("active");
  } else {
    map.locate({ watch: true });
    watchLocation = true;
    $("#location_watch_toggle").addClass("active");
  }
}

export function setLastZoomLevel(zoomLevel) {
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

  for (var i = 0; i < dataBahnhoefe.length; ++i) {
    if (dataBahnhoefe[i].idStr === stationId) {
      var station = dataBahnhoefe[i];
      timetable(station.country, station.idStr, station.title, station.DS100);
      return;
    }
  }
}

function showPopup(feature) {
  "use strict";

  L.popup()
    .setLatLng([feature.properties.lat, feature.properties.lon])
    .setContent(stationHtml(feature))
    .openOn(map);
}

function showMissingStationPopup(mouseEvent) {
  "use strict";

  const missingStationUploadUrl = `upload.php?latitude=${mouseEvent.latlng.lat}&longitude=${mouseEvent.latlng.lng}`;
  const str = `
<h3>${getI18nStrings().index.addMissingStation}</h3>
<div>${getI18nStrings().index.location}: ${mouseEvent.latlng.lat},${
    mouseEvent.latlng.lng
  }</div>
<div>
    <a href="${missingStationUploadUrl}"
        title="${getI18nStrings().index.uploadPhoto}">
        <i class="fas fa-upload">${getI18nStrings().index.uploadYourPhoto}.</i>
    </a>
</div>
`;

  if (null === popup) {
    popup = L.popup();
  }

  popup
    .setLatLng([mouseEvent.latlng.lat, mouseEvent.latlng.lng])
    .setContent(str)
    .openOn(map);
}

function setMapViewport(markerBounds) {
  "use strict";

  if (getLastZoomLevel() != null) {
    setzoomlevel = true;
    map.setZoom(getLastZoomLevel());
    setzoomlevel = false;
  }

  if (getLastPos() != null) {
    map.panTo(getLastPos());
  } else {
    map.fitBounds(markerBounds); //set view on the cluster extend
  }
}

function showMarkerImagesClustered() {
  "use strict";

  $("body").addClass("showCluster");
  if (markers) {
    map.removeLayer(markers);
  }
  markers = L.markerClusterGroup({
    iconCreateFunction: function(cluster) {
      var markers = cluster.getAllChildMarkers(),
        red = 0,
        green = 0,
        max = markers.length,
        i;
      for (i = 0; i < max; ++i) {
        red +=
          markers[i].options.icon.options.iconUrl.indexOf("red") > 0 ? 1 : 0;
        green +=
          markers[i].options.icon.options.iconUrl.indexOf("green") > 0 ||
          markers[i].options.icon.options.iconUrl.indexOf("violet") > 0
            ? 1
            : 0;
      }
      let stokeDasharray =
        green === max ? 101 : parseInt((green / max) * 100, 10);
      return new L.divIcon({
        html: `
          <svg width="40" height="40" class="circle">
            <circle r="16" cx="20" cy="20" class="pie" style="stroke-dasharray:${stokeDasharray}, 1000;"/>
          </svg>
          <div>
            <span>${max}</span>
            <span>${parseInt((green / max) * 100, 10)}%</span>
          </div>
          `,
        className: "marker-cluster marker-cluster-large",
        iconSize: new L.Point(40, 40)
      });
    }
  });

  var bahnhoefe = L.featureGroup().on("click", function(event) {
      showPopup(event.layer.options);
    }),
    i,
    customIcon,
    marker;

  dataBahnhoefe.forEach(bahnhof => {
    let iconUrl;
    if (bahnhof.photographer === null) {
      iconUrl = `./images/pointer-red.png`;
    } else if (bahnhof.photographer === nickname) {
      iconUrl = `./images/pointer-violet.png`;
    } else {
      iconUrl = `./images/pointer-green.png`;
    }
    customIcon = L.icon({
      iconUrl: iconUrl,
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      popupAnchor: [0, -28]
    });
    marker = L.marker([bahnhof.lat, bahnhof.lon], {
      icon: customIcon,
      properties: bahnhof
    }).addTo(bahnhoefe);
  });

  markers.addLayer(bahnhoefe); // add it to the cluster group
  map.addLayer(markers); // add it to the map

  setMapViewport(markers.getBounds());
}

function showCircleAllClustered() {
  "use strict";

  if (markers) {
    map.removeLayer(markers);
  }
  markers = L.layerGroup();

  let bahnhoefe = L.featureGroup().on("click", function(event) {
      showPopup(event.layer.options);
    }),
    i;

  dataBahnhoefe.forEach(bahnhof => {
    let color;
    if (bahnhof.photographer === null) {
      color = "#B70E3D";
    } else if (bahnhof.photographer === nickname) {
      color = "#8000FF";
    } else {
      color = "#3db70e";
    }

    L.circleMarker([bahnhof.lat, bahnhof.lon], {
      fillColor: color,
      fillOpacity: 1,
      stroke: false,
      properties: bahnhof
    }).addTo(bahnhoefe);
  });

  markers.addLayer(bahnhoefe); // add it to the cluster group
  map.addLayer(markers); // add it to the map

  setMapViewport(bahnhoefe.getBounds());
}

function updateMarker(showPoints) {
  "use strict";

  if (showPoints) {
    showCircleAllClustered();
  } else {
    showMarkerImagesClustered();
  }
}

function getStationsURL() {
  "use strict";

  return getAPIURI() + getCountryCode() + "/stations";
}

export function switchCountryLink(countryCode) {
  "use strict";

  setCountryCode(countryCode);

  $("#details").hide();
  $("#karte").show();
  $(".header .mobile-menu:visible .ui-link").click();

  initCountry();

  fetch(getStationsURL())
    .then(r => r.json())
    .then(data => {
      dataBahnhoefe = data;

      setLastZoomLevel(null);
      setLastPos(null);
      updateMarker(getBoolFromLocalStorage("showPoints", false));
    });
}

function getTotalCountPhotos() {
  "use strict";

  return dataBahnhoefe.filter(bahnhof => bahnhof.photographer !== null).length;
}

export function showHighScore() {
  "use strict";

  let html = "";

  const statisticUrl = getAPIURI() + getCountryCode() + "/photographers";
  fetch(statisticUrl)
    .then(r => r.json())
    .then(statistics => {
      let rang = 0;
      let lastPhotoCount = -1;
      let countPhotographers = 0;
      Object.entries(statistics).forEach(entry => {
        const name = entry[0];
        const currentPhotoCount = entry[1];

        countPhotographers++;
        if (lastPhotoCount !== currentPhotoCount) {
          rang = rang + 1;
        } else {
          lastPhotoCount = currentPhotoCount;
        }
        let crown = "";
        if (rang === 1) {
          crown = '<img src="images/crown_gold.png"/>';
        } else if (rang === 2) {
          crown = '<img src="images/crown_silver.png"/>';
        } else if (rang === 3) {
          crown = '<img src="images/crown_bronze.png"/>';
        } else {
          crown = rang + ".";
        }

        html += `
           <tr>
            <td>${crown}</td>
            <td>${name}</td>
            <td><a data-ajax="false" href="photographer.php?photographer=${name}">${name}</a></td>
          </tr>
          `;
      });
      showHighScorePopup(countPhotographers, html);
    })
    .catch(() => {
      showHighScorePopup(-1, "Something went wrong");
    });
}

function showHighScorePopup(countPhotographers, highscoreTable) {
  const countPhotos = getTotalCountPhotos();
  const countStations = dataBahnhoefe.length;
  const percentPhotos = (countPhotos / countStations) * 100;

  getCountryByCode(getCountryCode(), function(country) {
    document.getElementById("highscoreBody").innerHTML = `
<div class="progress">
    <div class="progress-bar bg-success" role="progressbar" style="width: ${percentPhotos}%;"
         aria-valuenow="${percentPhotos}" aria-valuemin="0" aria-valuemax="100">${countPhotos}
        ${getI18nStrings().index.of} ${countStations} ${
      getI18nStrings().index.photos
    }
    </div>
</div><p style="padding-top: 10px;font-weight: bold;">${countPhotographers} ${
      getI18nStrings().index.photographers
    }</p>
<table class="table table-striped">${highscoreTable}</table>
      `;

    document.getElementById("highscoreLabel").innerHTML = `${
      getI18nStrings().index.highscore
    }: ${country.name}`;
    $("#highscore").modal("show");
  });
}

function initCountry() {
  fetchCountries(function(countries) {
    const menu = document.getElementById("countries");
    let menuItems = "";
    const currentCountry = getCountryCode();

    countries.sort(function(a, b) {
      return a.name.localeCompare(b.name);
    });

    countries.forEach(country => {
      let code = country.code;
      let name = country.name;
      menuItems += `<a class="dropdown-item" href="javascript:map.switchCountryLink('${code}');" title="${name}">${name}</a>`;
      if (code === currentCountry) {
        document.getElementById("country").innerHTML = name;
        document.title = `RailwayStations - ${name}`;
      }
    });

    menu.innerHTML = menuItems;
  });
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

  const osmTileLayer = L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
      maxZoom: 18,
      attribution:
        '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
    }
  ).addTo(map);

  map.spin(true);

  map.on("contextmenu", function(ev) {
    showMissingStationPopup(ev);
  });

  nickname = getUserProfile().nickname;
  initCountry();

  fetch(getStationsURL())
    .then(r => r.json())
    .then(data => {
      dataBahnhoefe = data;
      const showPoints = getBoolFromLocalStorage("showPoints", false);
      updateMarker(showPoints);
    })
    .then(function() {
      // alert( "second success" );
      map.spin(false);
      map.on("locationfound", function(ev) {
        if (ownMarker != null) {
          ownMarker.setLatLng(ev.latlng);
          ownMarker.update();
        } else {
          var customIcon = L.icon({
            iconUrl: "./images/pointer-blue.png",
            iconSize: [50, 50],
            iconAnchor: [25, 50],
            popupAnchor: [0, -28]
          });
          ownMarker = L.marker(ev.latlng, { icon: customIcon });
          ownMarker.addTo(map);
        }
        map.panTo(ev.latlng); // ev is an event object (MouseEvent in this case)
      });
      map.on("locationerror", function(ev) {
        map.stopLocate();
        watchLocation = false;
        $("#location_watch_toggle").removeClass("active");
        console.log("Position konnte nicht ermittelt werden");
      });
      map.on("zoomend", function(ev) {
        if (!setzoomlevel) {
          setLastZoomLevel(map.getZoom());
        }
      });
      map.on("moveend", function(ev) {
        setLastPos(map.getCenter());
      });
    })
    .catch(error => {
      alert(`error: ${error}`);
      map.spin(false);
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
      map.panTo(L.latLng(bahnhof[0].lat, bahnhof[0].lon));
      map.setZoom(14);

      var bahnhofMarkers = markers.getLayers();
      if (!bahnhofMarkers[0].options) {
        bahnhofMarkers = bahnhofMarkers[0].getLayers();
      }
      for (var i in bahnhofMarkers) {
        var markerID = bahnhofMarkers[i].options.properties.idStr;
        if (markerID === suggestion.data) {
          showPopup(bahnhofMarkers[i].options);
        }
      }
      return false;
    }
  });
});
