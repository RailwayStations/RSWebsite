import { PasswordClient } from "../client/PasswordClient";
import { UserProfile } from "../UserProfile";
import { getI18n } from "../../i18n";
import { AbstractFormView } from "./AbstractFormView";

class PasswordChangeView extends AbstractFormView {
  static load() {
    document.getElementById("profileForm").classList.add("hidden");
    document.getElementById("passwordChangeForm").classList.remove("hidden");

    PasswordChangeView.closeButton();
    PasswordChangeView.submitButton();
  }

  static closeButton() {
    document
      .getElementById("passwordChangeCancel")
      .addEventListener("click", () => {
        document.getElementById("passwordChangeForm").classList.add("hidden");
        document.getElementById("profileForm").classList.remove("hidden");
      });
  }

  static submitButton() {
    document
      .getElementById("passwordChangeSubmit")
      .addEventListener("click", () => {
        const newPassword = document.getElementById("newPassword").value;
        const newPasswordRepeat =
          document.getElementById("newPasswordRepeat").value;
        if (newPassword !== newPasswordRepeat) {
          PasswordChangeView.showError(
            getI18n(s => s.settings.passwordMismatch)
          );
        } else {
          PasswordClient.updatePassword(newPassword).then(r => {
            if (r.ok) {
              const currentUserProfile = UserProfile.currentUser();
              currentUserProfile.password = newPassword;
              currentUserProfile.save();
              localStorage.removeItem("access_token");
              location.href =
                "settings.php?success=" +
                encodeURIComponent(
                  getI18n(s => s.settings.passwordChangedLogInAgain)
                );
            } else {
              const unableToChangePassword = getI18n(
                s => s.settings.unableToChangePassword
              );
              PasswordChangeView.showError(
                `${unableToChangePassword}: ${r.status}`
              );
            }
          });
        }
      });
  }
}

export { PasswordChangeView };
