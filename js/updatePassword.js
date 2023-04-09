import $ from "jquery";
import "bootstrap";
import { getQueryParameter } from "./common";
import { UserProfile } from "./settings/UserProfile";

function initUpdatePassword() {
  const vars = getQueryParameter();
  const uploadToken = vars.uploadToken;
  const userProfile = UserProfile.currentUser();

  if (uploadToken && uploadToken.length > 0) {
    userProfile.password = uploadToken;
    userProfile.save();
  }
}

$(function () {
  initUpdatePassword();
});
