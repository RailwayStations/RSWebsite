import {
  getBoolFromLocalStorage,
  getQueryParameter,
  getUserProfile
} from "../common";
import $ from "jquery";
import { showPopup } from "./popup";
import { getLastPos, getLastZoomLevel } from "./map";

let _markers = undefined;

export function updateMarker(dataBahnhoefe, map, setViewPort = true) {
  if (!!_markers) {
    map.removeLayer(_markers);
  }

  const displayAsPoints = getBoolFromLocalStorage("showPoints", false);
  _markers = displayAsPoints
    ? showPoints(dataBahnhoefe, map)
    : showClustered(dataBahnhoefe, map);
  map.addLayer(_markers);
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

let markerRadius = function(map) {
  if (!!getQueryParameter().beta) {
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
  } else {
    return 10;
  }
};

function showPoints(dataBahnhoefe, map) {
  const markers = L.featureGroup();

  const bahnhoefe = L.featureGroup().on("click", function(event) {
    showPopup(event.layer.options, map);
  });

  const nickname = getUserProfile().nickname;

  const radius = markerRadius(map);

  const rawMarkers = dataBahnhoefe.map(bahnhof => {
    let color;
    if (bahnhof.photographer === null) {
      color = "#B70E3D";
    } else if (bahnhof.photographer === nickname) {
      color = "#8000FF";
    } else {
      color = "#3db70e";
    }

    return L.circleMarker([bahnhof.lat, bahnhof.lon], {
      fillColor: color,
      fillOpacity: 1,
      radius: radius,
      stroke: false,
      properties: bahnhof
    }).addTo(bahnhoefe);
  });

  if (!!getQueryParameter().beta) {
    map.on("zoomend", function(e) {
      const radius = markerRadius(map);
      rawMarkers.forEach(m => m.setRadius(radius));
    });
  }

  markers.addLayer(bahnhoefe); // add it to the cluster group
  return markers;
}

function showClustered(dataBahnhoefe, map) {
  $("body").addClass("showCluster");

  const markers = L.markerClusterGroup({
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

  const bahnhoefe = L.featureGroup().on("click", function(event) {
    showPopup(event.layer.options, map);
  });

  const nickname = getUserProfile().nickname;

  dataBahnhoefe.forEach(bahnhof => {
    let iconUrl;
    if (bahnhof.photographer === null) {
      iconUrl = `./images/pointer-red.png`;
    } else if (bahnhof.photographer === nickname) {
      iconUrl = `./images/pointer-violet.png`;
    } else {
      iconUrl = `./images/pointer-green.png`;
    }
    const customIcon = L.icon({
      iconUrl: iconUrl,
      iconSize: [50, 50],
      iconAnchor: [25, 50],
      popupAnchor: [0, -28]
    });
    L.marker([bahnhof.lat, bahnhof.lon], {
      icon: customIcon,
      properties: bahnhof
    }).addTo(bahnhoefe);
  });

  markers.addLayer(bahnhoefe); // add it to the cluster group
  return markers;
}
