import "leaflet";
import { stationHtml } from "./station";
import { getI18n } from "../i18n";

export function showPopup(feature, map) {
  "use strict";

  L.popup()
    .setLatLng([feature.properties.lat, feature.properties.lon])
    .setContent(stationHtml(feature))
    .openOn(map);
}

export function showMissingStationPopup(mouseEvent, map) {
  "use strict";

  const missingStationUploadUrl = `upload.php?latitude=${mouseEvent.latlng.lat}&longitude=${mouseEvent.latlng.lng}`;
  const str = `
<h3>${getI18n(s => s.index.addMissingStation)}</h3>
<div>${getI18n(s => s.index.location)}: ${mouseEvent.latlng.lat},${
    mouseEvent.latlng.lng
  }</div>
<div>
    <a href="${missingStationUploadUrl}"
        title="${getI18n(s => s.index.uploadPhoto)}">
        <i class="fas fa-upload">${getI18n(s => s.index.uploadYourPhoto)}.</i>
    </a>
</div>
`;

  L.popup()
    .setLatLng([mouseEvent.latlng.lat, mouseEvent.latlng.lng])
    .setContent(str)
    .openOn(map);
}
