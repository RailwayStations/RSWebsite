import { getI18n } from "../../i18n";
import { isBlank, isNotBlank } from "../../common";

const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

class AbstractFormView {
  static updateFieldsOfFormWith(currentUser) {
    document.getElementById("profileNickname").value = currentUser.nickname;
    document.getElementById("profileEmail").value = currentUser.email;
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
    currentUser.photoOwner = document.getElementById(
      "profilePhotoOwner"
    ).checked;
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
    const cc0 = document.getElementById("profileCc0").checked;
    const photoOwner = document.getElementById("profilePhotoOwner").checked;
    const nickname = document.getElementById("profileNickname").value;
    const email = document.getElementById("profileEmail").value;
    const link = document.getElementById("profileLink").value;
    if (!cc0) {
      throw getI18n(s => s.settings.acceptCC0);
    }
    if (!photoOwner) {
      throw getI18n(s => s.settings.ownPhotos);
    }
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
