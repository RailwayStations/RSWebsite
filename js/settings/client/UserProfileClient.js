import { getAPIURI, getAuthorization } from "../../common";
import { UserProfile } from "../UserProfile";
import { getI18n } from "../../i18n";

class UserProfileClient {
  static uploadProfile(userProfile) {
    return fetch(getAPIURI() + "myProfile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: getAuthorization(),
      },
      body: userProfile.toJson(),
    });
  }

  static requestVerificationMail(userProfile) {
    return fetch(getAPIURI() + "resendEmailVerification", {
      method: "POST",
      headers: {
        Authorization: getAuthorization(),
      },
    });
  }

  static deleteAccount(userProfile) {
    return fetch(getAPIURI() + "myProfile", {
      method: "DELETE",
      headers: {
        Authorization: getAuthorization(),
      },
    });
  }

  static getProfile(userProfile) {
    return fetch(getAPIURI() + "myProfile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: getAuthorization(),
      },
    })
      .then(
        r =>
          new Promise((resolve, reject) => {
            if (r.ok) {
              resolve(r.json());
            } else {
              throw new Error(getI18n(s => s.settings.loginFailed));
            }
          })
      )
      .then(data => new UserProfile(data))
      .then(newUserProfile => {
        newUserProfile.password = userProfile.password;
        return newUserProfile;
      });
  }
}

export { UserProfileClient };
