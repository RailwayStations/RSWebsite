import { getAPIURI } from "../../common";
import { UserProfile } from "../UserProfile";

class PasswordClient {
  static updatePassword(newPassword) {
    const currentUser = UserProfile.currentUser();
    const email = currentUser.email;
    const password = currentUser.password;

    return fetch(getAPIURI() + "changePassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/text; charset=utf-8",
        "New-Password": encodeURIComponent(newPassword),
        Authorization: getAuthorization(),
      },
    });
  }
}

export { PasswordClient };
