import { getAPIURI, getAuthorization } from "../../common";

class PasswordClient {
  static updatePassword(newPassword) {
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
