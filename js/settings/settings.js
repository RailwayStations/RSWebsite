import $ from "jquery";
import "../../css/settings.css";
import { getQueryParameter } from "../common";
import { UserProfile } from "./UserProfile";
import { LoginView } from "./view/LoginView";
import { EditView } from "./view/EditView";
import { MapSettingsView } from "./view/MapSettingsView";

function initSettings() {
  var q = getQueryParameter();

  if (q.error) {
    localStorage.removeItem("access_token");
    LoginView.showError(decodeURIComponent(q.error));
    return false;
  } else if (q.warning) {
    LoginView.showWarning(decodeURIComponent(q.warning));
  } else if (q.success) {
    LoginView.showWarning(decodeURIComponent(q.success));
  }

  if (!LoginView.handleAuthorizationCallback(q)) {
    if (UserProfile.isLoggedIn()) {
      EditView.load();
    } else {
      LoginView.load();
    }
  }
  MapSettingsView.load();
}

$(function () {
  initSettings();
});
