import { getBoolFromLocalStorage, getUserProfile } from "../common";
import $ from "jquery";
import { showPopup } from "./popup";

export function updateMarker(dataBahnhoefe, map) {
  "use strict";

  const showPoints = getBoolFromLocalStorage("showPoints", false);
  const markers = showPoints
    ? showCircleAllClustered(dataBahnhoefe, map)
    : showMarkerImagesClustered(dataBahnhoefe, map);
  map.addLayer(markers);
  return markers;
}

function showCircleAllClustered(dataBahnhoefe, map) {
  "use strict";

  const markers = L.layerGroup();

  let bahnhoefe = L.featureGroup().on("click", function(event) {
    showPopup(event.layer.options, map);
  });

  const nickname = getUserProfile().nickname;

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

  return markers;
}

function showMarkerImagesClustered(dataBahnhoefe, map) {
  "use strict";

  $("body").addClass("showCluster");
  if (markers) {
    map.removeLayer(markers);
  }
  let markers = L.markerClusterGroup({
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
    const marker = L.marker([bahnhof.lat, bahnhof.lon], {
      icon: customIcon,
      properties: bahnhof
    }).addTo(bahnhoefe);
  });

  markers.addLayer(bahnhoefe); // add it to the cluster group
  return markers;
}
