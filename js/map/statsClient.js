import { getAPIURI } from "../common";

class CountryStats {
  constructor(data) {
    this.data = data;
  }

  static async get(countryCode) {
    let statsUrl;
    if (countryCode === "all") {
      statsUrl = getAPIURI() + "stats";
    } else {
      statsUrl = getAPIURI() + countryCode + "/stats";
    }
    let result;
    await fetch(statsUrl)
      .then(r => r.json())
      .then(data => (result = new CountryStats(data)));

    return result;
  }

  get total() {
    return this.data.total;
  }

  get withPhoto() {
    return this.data.withPhoto;
  }

  get withoutPhoto() {
    return this.data.withoutPhoto;
  }

  get photographers() {
    return this.data.photographers;
  }
}

export { CountryStats };
