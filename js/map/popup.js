import "leaflet";
import { stationHtml } from "./station";
import { getI18nStrings } from "../i18n";
import { fetchCountries, getCountryByCode, getCountryCode } from "../common";
import $ from "jquery";
import { CountryStats } from "./statsClient";

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

const highScoreCountryDropDown = function(countries, currentCountryCode) {
  const allOption = `<a class="dropdown-item" href="javascript:map.showHighScore('all');" title="${
    getI18nStrings().index.allCountries
  }">${getI18nStrings().index.allCountries}</a>`;
  let countryOptions = "";
  countries.forEach(
    country =>
      (countryOptions += `<a class="dropdown-item" href="javascript:map.showHighScore('${country.code}');" title="${country.name}">${country.name}</a>`)
  );

  const currentCountryName =
    currentCountryCode === "all"
      ? getI18nStrings().index.allCountries
      : countries.find(country => country.code === currentCountryCode).name;
  return `
<div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    ${currentCountryName}
  </button>
  <div class="dropdown-menu scrollable-menu" aria-labelledby="dropdownMenuButton">
    ${allOption}
    ${countryOptions}
  </div>
</div>
  `;
};

export async function showHighScorePopup(highscoreTable, countryCode) {
  const countryStats = await CountryStats.get(countryCode);
  const countries = await fetchCountries();
  const countPhotos = countryStats.withPhoto;
  const countStations = countryStats.total;
  const percentPhotos = (countPhotos / countStations) * 100;

  const body = document.getElementById("highscoreBody");
  const countryStatistics = `
  ${getI18nStrings().index.of} ${countStations} ${getI18nStrings().index.photos}
  `;
  const countPhotographersString = `${countryStats.photographers} ${
    getI18nStrings().index.photographers
  }`;
  body.innerHTML = `
      <div class="progress">
          <div class="progress-bar bg-success" role="progressbar" style="width: ${percentPhotos}%;"
               aria-valuenow="${percentPhotos}" aria-valuemin="0" aria-valuemax="100">${countPhotos}
              ${countryStatistics}
          </div>
      </div><p style="padding-top: 10px;font-weight: bold;">${countPhotographersString}</p>
      <table class="table table-striped">${highscoreTable}</table>
    `;

  const label = document.getElementById("highscoreLabel");
  const dropDown = highScoreCountryDropDown(countries, countryCode);
  label.innerHTML = `${getI18nStrings().index.highscore}: ${dropDown}`;
  $("#highscore").modal("show");
}
