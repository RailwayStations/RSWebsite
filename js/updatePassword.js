import $ from "jquery";
import { getQueryParameter, setUserProfile } from "./common";
import "bootstrap";

$(document).ready(function() {
  const vars = getQueryParameter();
  const uploadToken = vars.uploadToken;
  const userProfile = getUserProfile();

  if (uploadToken && uploadToken.length > 0) {
    userProfile.password = uploadToken;
    delete userProfile.uploadToken;
    setUserProfile(userProfile);
  }
});
