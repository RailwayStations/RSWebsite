import $ from "jquery";
import "bootstrap";
import { getQueryParameter, getAPIURI, initRSAPI } from "./common";
import { getI18n } from "./i18n";

function initEmailVerification() {
  const vars = getQueryParameter();
  const token = vars.token;

  $.ajax({
    url: `${getAPIURI()}emailVerification/${token}`,
    type: "GET",
    crossDomain: true,
    error: function () {
      $("#emailVerificationResult").html(
        getI18n(s => s.emailVerification.error)
      );
    },
    success: function (obj) {
      $("#emailVerificationResult").html(
        getI18n(s => s.emailVerification.success)
      );
    },
  });
}

$(function () {
  initRSAPI().then(function () {
    initEmailVerification();
  });
});
