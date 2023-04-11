import $ from "jquery";
import { getAPIURI, getQueryParameter, scaleImage } from "./common";
import "bootstrap";
import { getI18n } from "./i18n";

window.$ = $;

function initPhotographer() {
  const vars = getQueryParameter();
  const photographer = vars.photographer;

  $("#title-form").html(
    `${getI18n(s => s.photographer.photosBy)} ${photographer}`
  );

  $.ajax({
    url: `${getAPIURI()}photoStationsByPhotographer/${photographer}`,
    type: "GET",
    dataType: "json",
    error: function () {
      $("#stations").html(
        `${getI18n(
          s => s.photographer.errorLoadingStationsOfPhotographer
        )} ${photographer}`
      );
    },
    success: function (photoStations) {
      var photoBaseUrl = photoStations.photoBaseUrl;
      var licenses = photoStations.licenses;
      var photographers = photoStations.photographers;

      if (photographers.length > 0) {
        $("#title-form").html(
          `${getI18n(s => s.photographer.photosBy)} <a href="${
            photographers[0].url
          }">${photographer}</a>`
        );
      }

      if (photoStations.stations.length > 0) {
        for (let i = 0; i < photoStations.stations.length; i++) {
          let station = photoStations.stations[i];
          for (let p = 0; p < station.photos.length; p++) {
            let photo = station.photos[p];
            const photoURL = scaleImage(photoBaseUrl + photo.path, 301);
            const detailLink = `station.php?countryCode=${station.country}&stationId=${station.id}&photoId=${photo.id}`;
            for (let l = 0; l < licenses.length; l++) {
              if (licenses[l].id === photo.license) {
                var license = licenses[l];
                break;
              }
            }
            $("#stations").append(
              `
  <div class="col mb-4">            
  <div class="card" style="max-width: 302px;">
      <div class="card-body"><h5 class="card-title"><a href="${detailLink}" data-ajax="false">${
                station.title
              }</a></h5>
          <p class="card-text">
              <small class="text-muted">
                  ${getI18n(s => s.photographer.licence)}: <a href="${
                license.url
              }">${license.name}</a>
              </small>
          </p>
      </div>
      <a href="${detailLink}" data-ajax="false">
          <img src="${photoURL}" class="card-img-top" loading="lazy" style="width:301px;" alt="${
                station.title
              }">
      </a>
  </div>
  </div>
  `
            );
          }
        }
      } else {
        $("#stations").html(getI18n(s => s.photographer.noStationsFound));
      }
    },
  });
}

$(function () {
  initPhotographer();
});
