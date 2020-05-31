import { PasswordClient } from "../client/PasswordClient";
import { UserProfileClient } from "../client/UserProfileClient";
import { UserProfile } from "../UserProfile";
import { RegistrationView } from "./RegistrationView";
import { getI18n } from "../../i18n";

class LoginView {
  static load() {
    const loginForm = document.getElementById("loginForm");
    loginForm.classList.remove("hidden");
    document
      .getElementById("loginButton")
      .addEventListener("click", LoginView.login);
    document
      .getElementById("resetPasswordButton")
      .addEventListener("click", () => {
        const email = document.getElementById("loginEmail").value;
        if (email.length === 0) {
          alert(getI18n(s => s.settings.insertEmailToResetPassword));
        } else {
          PasswordClient.resetPassword(email).then(r => {
            if (r.ok) {
              alert(getI18n(s => s.settings.newPasswordViaEmail));
              location.reload();
            } else if (r.status === 400) {
              alert(
                `${getI18n(
                  s => s.settings.missingEMail
                )}: Bahnhofsfotos@deutschlands-Bahnhoefe.de`
              );
            } else if (r.status === 404) {
              alert(getI18n(s => s.settings.noProfileFound));
            } else {
              alert(`${getI18n(s => s.settings.error)}: ${r.status}`);
            }
          });
        }
      });
    document
      .getElementById("registerButton")
      .addEventListener("click", RegistrationView.load);
  }

  static login() {
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;
    UserProfileClient.getProfile(UserProfile.authOnly(email, password))
      .then(userProfile => userProfile.save(), error => {
        throw error;
      })
      .then(() => location.reload(), error => {
        alert(`${getI18n(s => s.settings.loginFailed)}`);
      });
  }
}

export { LoginView };
