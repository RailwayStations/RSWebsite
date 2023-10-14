import { getAPIURI } from "./common";
import { getI18n } from "./i18n";

class CountryClient {
  static async getAllCountries() {
    this.getPromise().then(data => {
      const result = [];
      data.forEach(rawCountryData => result.push(new Country(rawCountryData)));
      return result;
    });
  }

  static getPromise() {
    let promise;

    if (sessionStorage.getItem("countries")) {
      promise = new Promise(resolve =>
        resolve(JSON.parse(sessionStorage.getItem("countries"))),
      );
    } else {
      promise = fetch(getAPIURI() + "countries")
        .then(r => r.json())
        .then(countries => {
          countries.forEach(country => {
            let translatedName = getI18n(
              s => s.common["country_" + country.code],
            );
            if (translatedName) {
              country.name = translatedName;
            }
          });

          console.log(countries);
          countries.sort(function (a, b) {
            return a.name.localeCompare(b.name);
          });
          console.log(countries);

          sessionStorage.setItem("countries", JSON.stringify(countries));
          return countries;
        });
    }

    return promise;
  }
}

class Country {
  constructor(rawData) {
    this._code = rawData._code;
    this._name = rawData._name;
    this._email = rawData._email;
    this._twitterTags = rawData._twitterTags;
    this._timetableUrlTemplate = rawData._timetableUrlTemplate;
    this._overrideLicense = rawData._overrideLicense;
    this._active = rawData._active;
    this._providerApps = rawData._providerApps;
    this._rawData = rawData;
  }

  get rawData() {
    return this._rawData;
  }

  get code() {
    return this._code;
  }

  get name() {
    return this._name;
  }

  get email() {
    return this._email;
  }

  get twitterTags() {
    return this._twitterTags;
  }

  get timetableUrlTemplate() {
    return this._timetableUrlTemplate;
  }

  get overrideLicense() {
    return this._overrideLicense;
  }

  get active() {
    return this._active;
  }

  get providerApps() {
    return this._providerApps;
  }
}

export { CountryClient };
