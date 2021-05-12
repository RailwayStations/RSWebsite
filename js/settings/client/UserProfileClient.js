import { getAPIURI } from "../../common";
import { UserProfile } from "../UserProfile";

class UserProfileClient {
  static uploadProfile(userProfile, authUser) {
    return fetch(getAPIURI() + "myProfile", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization:
          "Basic " + btoa(authUser.email + ":" + authUser.password),
      },
      body: userProfile.toJson(),
    });
  }

  static requestVerificationMail(userProfile) {
    return fetch(getAPIURI() + "resendEmailVerification", {
      method: "POST",
      headers: {
        Authorization:
          "Basic " + btoa(userProfile.email + ":" + userProfile.password),
      },
    });
  }

  static getProfile(userProfile) {
    return fetch(getAPIURI() + "myProfile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization:
          "Basic " + btoa(userProfile.email + ":" + userProfile.password),
      },
    })
      .then(
        r =>
          new Promise((resolve, reject) => {
            if (r.ok) {
              resolve(r.json());
            } else {
              throw new Error("Login failed");
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
