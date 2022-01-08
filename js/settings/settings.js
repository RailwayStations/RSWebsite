import $ from "jquery";
import "../../css/settings.css";
import { initRSAPI } from "../common";
import { UserProfile } from "./UserProfile";
import { LoginView } from "./view/LoginView";
import { EditView } from "./view/EditView";
import { MapSettingsView } from "./view/MapSettingsView";

function initSettings() {
  const currentUser = UserProfile.currentUser();
  if (currentUser.isLoggedIn()) {
    EditView.load();
  } else {
    LoginView.load();
  }
  MapSettingsView.load();
}

$(function () {
  initRSAPI().then(function () {
    initSettings();
  });
});
