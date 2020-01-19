import "../../css/settings.css";
import { UserProfile } from "./UserProfile";
import { LoginView } from "./view/LoginView";
import { EditView } from "./view/EditView";
import { MapSettingsView } from "./view/MapSettingsView";

const onPageLoad = () => {
  const currentUser = UserProfile.currentUser();
  if (currentUser.isLoggedIn()) {
    EditView.load();
  } else {
    LoginView.load();
  }
  MapSettingsView.load();
};

onPageLoad();
