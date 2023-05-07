import { getAPIURI, getAuthorization } from "../../common";

class PasswordClient {
  static updatePassword(newPassword) {
    var changePasswordCommand = {
      newPassword: newPassword,
    };

    return fetch(getAPIURI() + "changePassword", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        Authorization: getAuthorization(),
      },
      body: JSON.stringify(changePasswordCommand),
    });
  }
}

export { PasswordClient };
