import { fetchCountries, getAPIURI, getCountryCode } from "../common";
import { updateMarker } from "./markers";

function getStationsURL() {
  "use strict";

  return getAPIURI() + getCountryCode() + "/stations";
}

const loadStationDataFromCache = function(cachedData) {
  return new Promise(resolve => {
    resolve(JSON.parse(cachedData));
  });
};

const fetchStationData = function(countryCode) {
  return fetch(getStationsURL())
    .then(r => r.json())
    .then(data => {
      const jsonString = JSON.stringify(data);
      try {
        localStorage.setItem(`stations-${countryCode}`, jsonString);
      } catch (error) {
        console.log(`Unable to store data for stations-${countryCode}`, error);
      }
      return data;
    });
};

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

export const fetchStationDataPromise = function(map) {
  map.spin(true);
  initCountry();
  const countryCode = getCountryCode();

  const cachedData = localStorage.getItem(`stations-${countryCode}`);
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
