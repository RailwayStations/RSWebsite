import { getI18n } from "../i18n";
import { CountryStats } from "./statsClient";
import { fetchCountries, getAPIURI, getCountryCode } from "../common";
import { Modal } from "bootstrap";
import $ from "jquery";

export const showHighScorePopup = async selectedCountryCode => {
  let currentCountry;
  let countryStats;
  let statistics;
  const countries = await fetchCountries();

  if (!!selectedCountryCode) {
    if (selectedCountryCode === "all") {
      currentCountry = getI18n(s => s.index.allCountries);
      countryStats = await CountryStats.get("all");
      statistics = await fetch(getAPIURI() + "photographers").then(r =>
        r.json(),
      );
    } else {
      currentCountry = countries.find(
        country => country.code === selectedCountryCode,
      ).name;
      countryStats = await CountryStats.get(selectedCountryCode);
      statistics = await fetch(
        getAPIURI() + "photographers?country=" + selectedCountryCode,
      ).then(r => r.json());
    }
  } else {
    const resultingCountryCode = getCountryCode();
    currentCountry = countries.find(
      country => country.code === resultingCountryCode,
    ).name;
    countryStats = await CountryStats.get(resultingCountryCode);
    statistics = await fetch(
      getAPIURI() + "photographers?country=" + resultingCountryCode,
    ).then(r => r.json());
  }

  const label = createLabelWithDropDown(countries, currentCountry);
  const progressBar = createProgressBar(countryStats);
  const table = createTable(statistics);

  document.getElementById("highscoreLabel").innerHTML = label;
  document.getElementById("highscoreBody").innerHTML = `
      ${progressBar}
      ${table}
    `;
  let highscoreModal = Modal.getOrCreateInstance(
    document.getElementById("highscore"),
  );
  highscoreModal.show();
};

const createTable = function (statistics) {
  let rang = 0;
  let lastPhotoCount = -1;
  let result = "";
  Object.entries(statistics).forEach(entry => {
    const name = entry[0];
    const currentPhotoCount = entry[1];

    if (lastPhotoCount !== currentPhotoCount) {
      rang = rang + 1;
    }
    lastPhotoCount = currentPhotoCount;

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

    result += `
           <tr>
            <td>${crown}</td>
            <td><a href="photographer.php?photographer=${name}">${name}</a></td>
            <td>${currentPhotoCount}</td>
          </tr>
          `;
  });
  return `<table class="table table-striped">${result}</table>`;
};

const createProgressBar = function (countryStats) {
  const countPhotos = countryStats.withPhoto;
  const countStations = countryStats.total;
  const percentPhotos = (countPhotos / countStations) * 100;
  const countPhotographers = countryStats.photographers;

  const of = getI18n(s => s.index.of);
  const photos = getI18n(s => s.index.photos);
  const stations = getI18n(s => s.index.stations);
  const photographers = getI18n(s => s.index.photographers);

  const countryStatistics = `${countPhotos} ${photos} ${of} ${countStations} ${stations}`;
  const countPhotographersString = `${countPhotographers} ${photographers}`;

  return `
      <div class="progress">
          <div class="progress-bar bg-success" role="progressbar" style="width: ${percentPhotos}%;" aria-valuenow="${percentPhotos}" aria-valuemin="0" aria-valuemax="100"></div>
          <div class="justify-content-center d-flex position-absolute w-100">${countryStatistics}</div>
      </div>
      <p style="padding-top: 10px;font-weight: bold;">${countPhotographersString}</p>
`;
};
const createLabelWithDropDown = function (countries, currentCountry) {
  const allCountries = getI18n(s => s.index.allCountries);
  const allOption = `<li><a class="dropdown-item" href="javascript:map.showHighScore('all');" title="${allCountries}">${allCountries}</a></li>`;
  let countryOptions = "";
  countries.forEach(country => {
    countryOptions += `<li><a class="dropdown-item" href="javascript:map.showHighScore('${country.code}');" title="${country.name}">${country.name}</a></li>`;
  });
  const dropDown = `
<div class="dropdown">
  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
    ${currentCountry}
  </button>
  <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
    ${allOption}
    ${countryOptions}
  </ul>  
</div>
  `;

  return `${getI18n(s => s.index.highscore)}: ${dropDown}`;
};
