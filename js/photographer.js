import $ from "jquery";
import { getAPIURI, getQueryParameter, scaleImage } from "./common";
import "bootstrap";

window.$ = $;

$(document).ready(function() {
  const vars = getQueryParameter();
  const photographer = vars.photographer;

  $("#photographer")
    .html(photographer)
    .attr("href", "index.php");

  $.ajax({
    url: `${getAPIURI()}stations?photographer=${photographer}`,
    type: "GET",
    dataType: "json",
    error: function() {
      $("#stations").html(
        `${window.i18n.photographer.errorLoadingStationsOfPhotographer} ${photographer}`
      );
    },
    success: function(obj) {
      if (Array.isArray(obj) && obj.length > 0) {
        $("#photographer").attr("href", obj[0].photographerUrl);
        for (let i = 0; i < obj.length; i++) {
          let station = obj[i];
          const photoURL = scaleImage(station.photoUrl, 301);
          const detailLink = `station.php?countryCode=${station.country}&stationId=${station.idStr}`;
          $("#stations").append(
            `
<div class="card mt-1" style="max-width: 302px;">
    <div class="card-body"><h5 class="card-title"><a href="${detailLink}" data-ajax="false">${station.title}</a></h5>
        <p class="card-text">
            <small class="text-muted">
                ${window.i18n.photographer.licence}: <a href="${station.licenseUrl}">${station.license}</a>
            </small>
        </p>
    </div>
    <a href="${detailLink}" data-ajax="false">
        <img src="${photoURL}" class="card-img-top" style="width:301px;" alt="${station.title}">
    </a>
</div>
`
          );
        }
      } else {
        $("#stations").html(window.i18n.photographer.noStationsFound);
      }
    }
  });
});
