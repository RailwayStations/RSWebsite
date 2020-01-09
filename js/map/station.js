import { scaleImage } from "../common";
import { getI18nStrings } from "../i18n";

export let stationHtml = function(feature) {
  const detailLink = `station.php?countryCode=${feature.properties.country}&stationId=${feature.properties.idStr}`;
  const photoURL = scaleImage(feature.properties.photoUrl, 301);

  let details = "";
  if (!feature.properties.active) {
    details =
      '<div><i class="fas fa-times-circle"></i> Dieser Bahnhof ist nicht aktiv!</i></div>';
  }

  if (feature.properties.photographer) {
    details += `
    <div><a href="${feature.properties.photographerUrl}"><i class="fas fa-user"></i>${feature.properties.photographer}</a></div>
    <div><a href="${feature.properties.licenseUrl}"><i class="fas fa-balance-scale"></i>${feature.properties.license}</a></div>
    `;
  } else {
    const country = feature.properties.country;
    const stationId = feature.properties.idStr;
    const stationName = feature.properties.title;
    const uploadUrl = `upload.php?countryCode=${country}&stationId=${stationId}&title=${stationName}`;
    details += `
    <div>
      <a href="${uploadUrl}"
         title="${getI18nStrings().index.uploadYourPhoto}">
          <i class="fas fa-upload"></i>${getI18nStrings().index.uploadYourPhoto}
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
  }

  const title = `
    <h3>
      <a href="${detailLink}">${feature.properties.title}</a>
    </h3>
    `;

  const links = `
    <div>
      <a href="#" onclick="navigate(${feature.properties.lat},${
    feature.properties.lon
  });">
        <i class="fas fa-directions"></i>${getI18nStrings().index.navigation}
      </a>
    </div>
    <div>
      <a href="#" onclick="map.timetableByStation('${
        feature.properties.idStr
      }');">
        <i class="fas fa-list"></i>${getI18nStrings().index.departureTimes}
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
