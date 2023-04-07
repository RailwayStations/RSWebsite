import { fetchCountries, getAPIURI, getCountryCode } from "../common";
import { updateMarker } from "./markers";
import { switchCountryLink } from "./map";

function getStationsURL() {
  "use strict";

  return getAPIURI() + "photoStationsByCountry/" + getCountryCode();
}

const loadStationDataFromCache = function (cachedData) {
  return new Promise(resolve => {
    resolve(JSON.parse(cachedData));
  });
};

const fetchStationData = function (countryCode) {
  return fetch(getStationsURL())
    .then(r => r.json())
    .then(data => {
      const jsonString = JSON.stringify(data);
      try {
        localStorage.setItem(`photostations-${countryCode}`, jsonString);
      } catch (error) {
        console.log(`Unable to store data for stations-${countryCode}`, error);
      }
      return data;
    });
};

function initCountry() {
  fetchCountries().then(countries => {
    const menu = document.getElementById("countries");
    menu.innerHTML = "";
    const currentCountry = getCountryCode();

    countries.forEach(country => {
      let code = country.code;
      let name = country.name;
      const link = document.createElement("div");
      link.classList.add("dropdown-item");
      link.addEventListener("click", () => switchCountryLink(code));
      link.title = name;
      link.innerHTML = name;
      menu.appendChild(link);
      if (code === currentCountry) {
        document.getElementById("country").innerHTML = name;
        document.title = `RailwayStations - ${name}`;
      }
    });
  });
}

export const fetchStationDataPromise = function (map) {
  map.spin(true);
  initCountry();
  const countryCode = getCountryCode();

  const cachedData = localStorage.getItem(`photostations-${countryCode}`);
  let promise;
  if (!cachedData) {
    promise = fetchStationData(countryCode);
  } else {
    promise = loadStationDataFromCache(cachedData);
    //update the stations in the background
    fetchStationData(countryCode).then(data => updateMarker(data, map, false));
  }
  return promise.then(data => {
    map.spin(false);
    return data;
  });
};
