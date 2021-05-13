import { scaleImage } from "../common";
import { getI18n } from "../i18n";

export let stationHtml = function (feature) {
  const detailLink = `station.php?countryCode=${feature.properties.country}&stationId=${feature.properties.idStr}`;
  const photoURL = scaleImage(feature.properties.photoUrl, 301);
  const country = feature.properties.country;
  const stationId = feature.properties.idStr;
  const stationName = feature.properties.title;

  let details = "";
  if (!feature.properties.active) {
    details = `<div><i class="fas fa-times-circle"></i> ${getI18n(
      s => s.station.inactive
    )}</i></div>`;
  }

  if (feature.properties.photographer) {
    details += `
    <div><a href="${feature.properties.photographerUrl}"><i class="fas fa-user"></i>${feature.properties.photographer}</a></div>
    <div><a href="${feature.properties.licenseUrl}"><i class="fas fa-balance-scale"></i>${feature.properties.license}</a></div>
    `;
  } else {
    const uploadUrl = `upload.php?countryCode=${country}&stationId=${stationId}&title=${stationName}`;
    details += `
    <div>
      <a href="${uploadUrl}"
         title="${getI18n(s => s.index.uploadYourPhoto)}">
          <i class="fas fa-upload"></i>${getI18n(s => s.index.uploadYourPhoto)}
      </a>
    </div>
    `;
  }

  let image = "";
  if (feature.properties.photographer) {
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
      <a href="${detailLink}">${feature.properties.title}</a>
    </h3>
    `;

  const problemUrl = `reportProblem.php?countryCode=${country}&stationId=${stationId}&title=${stationName}`;
  const links = `
    <div>
      <a href="#" onclick="navigate(${feature.properties.lat},${
    feature.properties.lon
  });">
        <i class="fas fa-directions"></i>${getI18n(s => s.index.navigation)}
      </a>
    </div>
    <div>
      <a href="#" onclick="map.timetableByStation('${
        feature.properties.idStr
      }');">
        <i class="fas fa-list"></i>${getI18n(s => s.index.departureTimes)}
      </a>
    </div>
    <div>
      <a href="${problemUrl}" title="${getI18n(s => s.index.reportProblem)}">
        <i class="fas fa-bullhorn"></i>${getI18n(s => s.index.reportProblem)}
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
