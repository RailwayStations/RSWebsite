import { getAPIURI, getQueryParameter, scaleImage, initRSAPI } from "./common";
import { getI18n } from "./i18n";

function toStationCardHtml(station) {
  const photoURL = scaleImage(station.photoUrl, 301);
  const detailLink = `station.php?countryCode=${station.country}&stationId=${station.idStr}`;
  return `
<div class="col mb-4">            
<div class="card" style="max-width: 302px;">
    <div class="card-body"><h5 class="card-title"><a href="${detailLink}" data-ajax="false">${
    station.title
  }</a></h5>
        <p class="card-text">
            <small class="text-muted">
                ${getI18n(s => s.photographer.licence)}: <a href="${
    station.licenseUrl
  }">${station.license}</a>
            </small>
        </p>
    </div>
    <a href="${detailLink}" data-ajax="false">
        <img src="${photoURL}" class="card-img-top" style="width:301px;" alt="${
    station.title
  }">
    </a>
</div>
</div>
`;
}

function initPhotographer() {
  const vars = getQueryParameter();
  const photographer = vars.photographer;

  document.getElementById("title-form").innerHTML = `${getI18n(
    s => s.photographer.photosBy
  )} ${photographer}`;

  fetch(`${getAPIURI()}stations?photographer=${photographer}`)
    .then(response => {
      if (!response.ok) {
        throw Error(
          `Got http response ${response.status} while requesting photographer "${photographer}"`
        );
      }

      return response.json();
    })
    .then(stations => {
      if (stations.length === 0) {
        document.getElementById("stations").innerHTML = getI18n(
          s => s.photographer.noStationsFound
        );
        return;
      }
      stations
        .map(station => toStationCardHtml(station))
        .forEach(
          station => (document.getElementById("stations").innerHTML += station)
        );
    })
    .catch(function (error) {
      document.getElementById("stations").innerHTML = `${getI18n(
        s => s.photographer.errorLoadingStationsOfPhotographer
      )} ${photographer}`;
      console.error(error.message);
    });
}

window.onload = () => initRSAPI().then(() => initPhotographer());

