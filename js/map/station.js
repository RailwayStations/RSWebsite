import { scaleImage } from "../common";
import { getI18n } from "../i18n";

export let stationHtml = function (feature, photoStations) {
  const station = feature.properties;
  const detailLink = `station.php?countryCode=${station.country}&stationId=${station.id}`;
  const country = station.country;
  const stationId = station.id;
  const stationName = station.title;

  let details = "";
  if (station.inactive) {
    details = `<div><i class="fas fa-times-circle"></i> ${getI18n(
      s => s.station.inactive
    )}</div>`;
  }

  if (station.photos.length > 0) {
    var photo = station.photos[0];
    for (let p = 0; p < photoStations.photographers.length; p++) {
      if (photoStations.photographers[p].name === photo.photographer) {
        var photographerUrl = photoStations.photographers[p].url;
        break;
      }
    }
    for (let l = 0; l < photoStations.licenses.length; l++) {
      if (photoStations.licenses[l].id === photo.license) {
        var licenseUrl = photoStations.licenses[l].url;
        var licenseName = photoStations.licenses[l].name;
        break;
      }
    }

    details += `
    <div><a href="${photographerUrl}"><i class="fas fa-user"></i> ${photo.photographer}</a></div>
    <div><a href="${licenseUrl}"><i class="fas fa-balance-scale"></i> ${licenseName}</a></div>
    `;
  }

  const uploadUrl = `upload.php?countryCode=${country}&stationId=${stationId}&title=${stationName}`;
  details += `
  <div>
    <a href="${uploadUrl}"
        title="${getI18n(s => s.index.uploadYourPhoto)}">
        <i class="fas fa-upload"></i> ${getI18n(s => s.index.uploadYourPhoto)}
    </a>
  </div>
  `;

  let image = "";
  if (station.photos.length > 0) {
    const photoURL = scaleImage(photoStations.photoBaseUrl + photo.path, 301);

    image = `
    <a href="${detailLink}">
       <img src="${photoURL}"/>
    </a>
    `;
  } else {
    image = `
    <a href="${detailLink}">
       <img src="images/default_klein.jpg"/>
    </a>
    `;
  }

  const title = `
    <h3>
      <a href="${detailLink}">${station.title}</a>
    </h3>
    `;

  const problemUrl = `reportProblem.php?countryCode=${country}&stationId=${stationId}&title=${stationName}`;
  const links = `
    <div>
      <a href="#" onclick="navigate(${station.lat},${station.lon});">
        <i class="fas fa-directions"></i> ${getI18n(s => s.index.navigation)}
      </a>
    </div>
    <div>
      <a href="#" onclick="map.timetableByStation('${station.id}');">
        <i class="fas fa-list"></i> ${getI18n(s => s.index.departureTimes)}
      </a>
    </div>
    <div>
      <a href="${problemUrl}" title="${getI18n(s => s.index.reportProblem)}">
        <i class="fas fa-bullhorn"></i> ${getI18n(s => s.index.reportProblem)}
      </a>
    </div>    
    `;

  return `
  <div class="station-popup">
    ${image}
    ${title}
    ${details}
    ${links}
  </div>
  `;
};
