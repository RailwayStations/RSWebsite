import $ from "jquery";
import "../../css/settings.css";
import { UserProfile } from "./UserProfile";
import { LoginView } from "./view/LoginView";
import { EditView } from "./view/EditView";
import { MapSettingsView } from "./view/MapSettingsView";

function initSettings() {
  const currentUser = UserProfile.currentUser();
  if (!LoginView.handleAuthorizationCallback()) {
    if (currentUser.isLoggedIn()) {
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
