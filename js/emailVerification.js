import $ from "jquery";
import "bootstrap";
import { getQueryParameter, getAPIURI } from "./common";
import { getI18n } from "./i18n";

$(document).ready(function () {
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
});
