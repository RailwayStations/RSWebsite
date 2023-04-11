import { UserProfileClient } from "../client/UserProfileClient";
import { PasswordChangeView } from "./PasswordChangeView";
import { UserProfile } from "../UserProfile";
import { getI18n } from "../../i18n";
import { AbstractFormView } from "./AbstractFormView";

class EditView extends AbstractFormView {
  static load() {
    const currentUser = UserProfile.currentUser();
    const profileForm = document.getElementById("profileForm");
    profileForm.classList.remove("hidden");
    document
      .getElementById("logout")
      .addEventListener("click", EditView.logout);
    EditView.updateFieldsOfFormWith(
      currentUser,
      EditView.requestVerificationMail
    );
    document.getElementById("saveProfile").addEventListener("click", () => {
      document.getElementById("saveProfileSpinner").classList.remove("hidden");
      try {
        EditView.updateWithForm(currentUser);
      } catch (e) {
        document.getElementById("saveProfileSpinner").classList.add("hidden");
        this.showError(e);
        return;
      }
      UserProfileClient.uploadProfile(currentUser).then(r => {
        document.getElementById("saveProfileSpinner").classList.add("hidden");
        if (r.ok) {
          currentUser.save();
          this.showSuccess(getI18n(s => s.settings.profileSaved));
        } else if (r.status === 400) {
          this.showError(
            `${getI18n(s => s.settings.invalidData)}: ${r.status} ${
              r.statusText
            }`
          );
        } else if (r.status === 401) {
          this.showError(getI18n(s => s.settings.loginFailed));
        } else if (r.status === 409) {
          this.showError(
            `${getI18n(s => s.settings.conflict)}: info@railway-stations.org`
          );
        } else {
          this.showError(
            `${getI18n(s => s.settings.profileSavedFailed)}: ${r.status} ${
              r.statusText
            }`
          );
        }
      });
    });
    document
      .getElementById("changePassword")
      .addEventListener("click", PasswordChangeView.load);
    document.getElementById("saveBtnText").innerHTML = getI18n(
      s => s.settings.save
    );

    const deleteAccount = document.getElementById("deleteAccount");
    deleteAccount.classList.remove("hidden");
    document
      .getElementById("deleteAccountSubmit")
      .addEventListener("click", EditView.deleteAccount);

    // update user profile
    UserProfileClient.getProfile(currentUser).then(
      userProfile => {
        userProfile.save();
        EditView.updateFieldsOfFormWith(
          userProfile,
          EditView.requestVerificationMail
        );
      },
      error => {
        localStorage.removeItem("access_token");
        location.href =
          "settings.php?error=" +
          encodeURIComponent(`${getI18n(s => s.settings.loginFailed)}`);
      }
    );
  }

  static deleteAccount() {
    var r = confirm(getI18n(s => s.settings.deleteAccountConfirmation));
    if (r == true) {
      const currentUser = UserProfile.currentUser();
      UserProfileClient.deleteAccount(currentUser).then(r => {
        if (r.ok) {
          this.showSuccess(getI18n(s => s.settings.deleteAccountSuccess));
          EditView.logout();
        } else {
          this.showError(
            getI18n(s => s.settings.deleteAccountFailed) +
              "info@railway-stations.org"
          );
        }
      });
    }
  }

  static logout() {
    UserProfile.delete();
    location.reload();
  }

  static requestVerificationMail() {
    const currentUser = UserProfile.currentUser();
    UserProfileClient.requestVerificationMail(currentUser).then(r => {
      if (r.ok) {
        this.showSuccess(getI18n(s => s.settings.verificationMailRequested));
      } else {
        this.showError(getI18n(s => s.settings.verificationMailRequestFailed));
      }
    });
  }
}

export { EditView };
