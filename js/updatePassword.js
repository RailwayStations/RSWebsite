import $ from "jquery";
import "bootstrap";
import { getQueryParameter } from "./common";
import { UserProfile } from "./settings/UserProfile";

$(document).ready(function () {
  const vars = getQueryParameter();
  const uploadToken = vars.uploadToken;
  const userProfile = UserProfile.currentUser();

  if (uploadToken && uploadToken.length > 0) {
    userProfile.password = uploadToken;
    userProfile.save();
  }
});
