import { getAPIURI } from "../../common";

class RegistrationClient {
  static register(userProfile) {
    return fetch(getAPIURI() + "registration", {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: userProfile.toJson(),
    });
  }
}

export { RegistrationClient };
