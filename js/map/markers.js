import {
  getBoolFromLocalStorage,
  getPhotoFilter,
  getActiveFilter,
} from "../common";
import $ from "jquery";
import { showPopup } from "./popup";
import { getLastPos, getLastZoomLevel } from "./map";
import { UserProfile } from "../settings/UserProfile";

let _markers = undefined;

export function updateMarker(
  photoStations,
  map,
  specialMarker,
  setViewPort = true,
) {
  if (!!_markers) {
    map.removeLayer(_markers);
  }

  const displayAsPoints = getBoolFromLocalStorage("showPoints", false);
  _markers = displayAsPoints
    ? showPoints(photoStations.stations, map, photoStations)
    : showClustered(photoStations.stations, map, photoStations);
  map.addLayer(_markers);
  if (specialMarker) {
    map.addLayer(specialMarker);
  }
  if (setViewPort) {
    setMapViewport(map, _markers);
  }
  return _markers;
}

function setMapViewport(map, markers) {
  if (getLastZoomLevel() != null) {
    map.setZoom(getLastZoomLevel());
  }

  if (getLastPos() == null) {
    map.fitBounds(markers.getBounds()); //set view on the cluster extend
  } else {
    map.panTo(getLastPos());
  }
}

function filterBahnhoefe(stations) {
  const photoFilter = getPhotoFilter();
  const activeFilter = getActiveFilter();

  return stations.filter((station, index, arr) => {
    if (photoFilter === "photoFilterWithPhoto" && station.photos.length == 0) {
      return false;
    }
    if (
      photoFilter === "photoFilterWithoutPhoto" &&
      station.photos.length > 0
    ) {
      return false;
    }
    if (activeFilter === "activeFilterActive" && station.inactive) {
      return false;
    }
    if (activeFilter === "activeFilterInactive" && !station.inactive) {
      return false;
    }
    return true;
  });
}

let markerRadius = function (map) {
  const currentZoom = map.getZoom();
  let result;
  if (currentZoom > 10) {
    result = 10;
  } else if (currentZoom < 5) {
    result = 1;
  } else {
    result = 10 - 9 * ((10 - currentZoom) / 5);
  }
  return result;
};

function showPoints(stations, map, photoStations) {
  const markers = L.featureGroup();

  const bahnhoefe = L.featureGroup().on("click", function (event) {
    showPopup(event.layer.options, map, photoStations);
  });

  const nickname = UserProfile.currentUser().nickname;

  const radius = markerRadius(map);

  const rawMarkers = filterBahnhoefe(stations).map(station => {
    let color;
    if (station.photos.length == 0) {
      color = "#B70E3D";
    } else if (station.photos[0].photographer === nickname) {
      color = "#8000FF";
    } else {
      color = "#3db70e";
    }

    return L.circleMarker([station.lat, station.lon], {
      fillColor: color,
      fillOpacity: 1,
      radius: radius,
      stroke: false,
      properties: station,
    }).addTo(bahnhoefe);
  });

  map.on("zoomend", function (e) {
    const radius = markerRadius(map);
    rawMarkers.forEach(m => m.setRadius(radius));
  });

  markers.addLayer(bahnhoefe); // add it to the cluster group
  return markers;
}

function showClustered(stations, map, photoStations) {
  $("body").addClass("showCluster");

  const markerCluster = L.markerClusterGroup({
    iconCreateFunction: function (cluster) {
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
        iconSize: new L.Point(40, 40),
      });
    },
  });

  const stationsLayer = L.featureGroup().on("click", function (event) {
    showPopup(event.layer.options, map, photoStations);
  });

  const nickname = UserProfile.currentUser().nickname;

  if (stations.forEach !== undefined) {
    filterBahnhoefe(stations).forEach(station => {
      let color;
      if (station.photos.length == 0) {
        color = `red`;
      } else if (station.photos[0].photographer === nickname) {
        color = `violet`;
      } else {
        color = `green`;
      }
      let inactive = ``;
      if (station.inactive) {
        inactive = `-inactive`;
      }
      const iconUrl = `./images/pointer-${color}${inactive}.png`;
      const customIcon = L.icon({
        iconUrl: iconUrl,
        iconSize: [50, 50],
        iconAnchor: [25, 50],
        popupAnchor: [0, -28],
      });
      L.marker([station.lat, station.lon], {
        icon: customIcon,
        properties: station,
      }).addTo(stationsLayer);
    });
  }

  markerCluster.addLayer(stationsLayer); // add it to the cluster group
  return markerCluster;
}
