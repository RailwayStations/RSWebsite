import { getI18n } from "../../i18n";
import { AbstractFormView } from "./AbstractFormView";
import { UserProfile } from "../UserProfile";
import { RegistrationClient } from "../client/RegistrationClient";

class RegistrationView extends AbstractFormView {
  static load() {
    document.getElementById("initialPasswordGrp").classList.remove("hidden");
    document
      .getElementById("initialPasswordRepeatGrp")
      .classList.remove("hidden");
    document.getElementById("loginForm").classList.add("hidden");
    document.getElementById("profileForm").classList.remove("hidden");
    document.getElementById("saveBtnText").innerHTML = getI18n(
      s => s.settings.register
    );
    document.getElementById("changePassword").classList.add("hidden");
    document.getElementById("logout").classList.add("hidden");
    document.getElementById("saveProfile").addEventListener("click", () => {
      const password = document.getElementById("password").value;
      const passwordRepeat = document.getElementById("passwordRepeat").value;
      if (password !== passwordRepeat) {
        alert(getI18n(s => s.settings.passwordMismatch));
      } else if (password.length < 8) {
        alert(getI18n(s => s.settings.passwordMinLength));
      } else {
        document
          .getElementById("saveProfileSpinner")
          .classList.remove("hidden");
        const newProfile = UserProfile.empty();
        try {
          RegistrationView.updateWithForm(newProfile);
        } catch (e) {
          document.getElementById("saveProfileSpinner").classList.add("hidden");
          alert(e);
          return;
        }
        RegistrationClient.register(newProfile).then(r => {
          if (r.ok) {
            newProfile.password = newProfile.newPassword;
            newProfile.newPassword = "";
            newProfile.save();
            alert(getI18n(s => s.settings.registrationSuccessfully));
            location.reload();
          } else {
            const conflict = getI18n(s => s.settings.conflict);
            alert(`${conflict}: Bahnhofsfotos@deutschlands-Bahnhoefe.de`);
          }
        });
      }
    });
  }
}

export { RegistrationView };
