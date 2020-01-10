import "leaflet";
import { stationHtml } from "./station";
import { getI18nStrings } from "../i18n";
import { getCountryByCode, getCountryCode } from "../common";
import $ from "jquery";

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

function getTotalCountPhotos(dataBahnhoefe) {
  "use strict";

  return dataBahnhoefe.filter(bahnhof => bahnhof.photographer !== null).length;
}

export function showHighScorePopup(
  dataBahnhoefe,
  countPhotographers,
  highscoreTable
) {
  const countPhotos = getTotalCountPhotos(dataBahnhoefe);
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
