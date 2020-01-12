import "leaflet";
import { stationHtml } from "./station";
import { getI18nStrings } from "../i18n";

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

  L.popup()
    .setLatLng([mouseEvent.latlng.lat, mouseEvent.latlng.lng])
    .setContent(str)
    .openOn(map);
}
