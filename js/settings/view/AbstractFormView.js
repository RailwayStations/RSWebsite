import { getI18n } from "../../i18n";
import { isBlank, isNotBlank } from "../../common";

const mailformat =
  /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

class AbstractFormView {
  static showError(message) {
    document.getElementById("error").innerText = message;
    document.getElementById("error").classList.remove("hidden");
    setTimeout(function () {
      document.getElementById("error").classList.add("hidden");
    }, 5000);
  }

  static showWarning(message) {
    document.getElementById("warning").innerText = message;
    document.getElementById("warning").classList.remove("hidden");
    setTimeout(function () {
      document.getElementById("warning").classList.add("hidden");
    }, 5000);
  }

  static showSuccess(message) {
    document.getElementById("success").innerText = message;
    document.getElementById("success").classList.remove("hidden");
    setTimeout(function () {
      document.getElementById("success").classList.add("hidden");
    }, 5000);
  }

  static updateFieldsOfFormWith(currentUser, requestVerificationMail) {
    document.getElementById("profileNickname").value = currentUser.nickname;
    document.getElementById("profileEmail").value = currentUser.email;
    if (currentUser.emailVerified) {
      document.getElementById("emailVerifiedLabel").innerHTML = getI18n(
        s => s.settings.emailVerified,
      );
      document.getElementById("emailVerifiedLabel").style.color = "green";
    } else {
      document.getElementById("emailVerifiedLabel").innerHTML = getI18n(
        s => s.settings.emailNotVerified,
      );
      document.getElementById("emailVerifiedLabel").style.color = "red";
      document
        .getElementById("request-verification-mail")
        .addEventListener("click", requestVerificationMail);
    }
    document.getElementById("profilePhotoOwner").checked =
      currentUser.photoOwner;
    document.getElementById("profileCc0").checked = currentUser.cc0;
    document.getElementById("profileAnonymous").checked = currentUser.anonymous;
    document.getElementById("profileLink").value = currentUser.link;
  }

  static updateWithForm(currentUser) {
    AbstractFormView.validateFields();
    currentUser.nickname = document.getElementById("profileNickname").value;
    currentUser.email = document.getElementById("profileEmail").value;
    currentUser.photoOwner =
      document.getElementById("profilePhotoOwner").checked;
    currentUser.cc0 = document.getElementById("profileCc0").checked;
    currentUser.anonymous = document.getElementById("profileAnonymous").checked;
    currentUser.link = document.getElementById("profileLink").value;
  }

  static isURL(str) {
    try {
      const url = new URL(str);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;
    }
  }

  static validateFields() {
    const nickname = document.getElementById("profileNickname").value;
    const email = document.getElementById("profileEmail").value;
    const link = document.getElementById("profileLink").value;
    if (isBlank(nickname)) {
      throw getI18n(s => s.settings.provideNickname);
    }
    if (isBlank(email)) {
      throw getI18n(s => s.settings.provideEmail);
    } else if (!email.match(mailformat)) {
      throw getI18n(s => s.settings.invalidEmail);
    }
    if (isNotBlank(link) && !AbstractFormView.isURL(link)) {
      throw getI18n(s => s.settings.provideValidUrl);
    }
  }
}

export { AbstractFormView };
