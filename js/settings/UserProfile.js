const cc0LicenceName = "CC0 1.0 Universell (CC0 1.0)";

class UserProfile {
  constructor(data) {
    this._email = data.email;
    this._nickname = data.nickname;
    this._link = data.link;
    this._license = data.license;
    this._photoOwner = data.photoOwner;
    this._anonymous = data.anonymous;
    this._admin = data.admin;
    this._emailVerified = data.emailVerified;
  }

  static isLoggedIn() {
    return !!localStorage.getItem("access_token");
  }

  save() {
    localStorage.setItem("userProfile", JSON.stringify(this));
  }

  isAllowedToUploadPhoto() {
    return this._emailVerified && this.cc0 && this._photoOwner;
  }

  isAllowedToReportProblem() {
    return this._emailVerified;
  }

  static delete() {
    localStorage.removeItem("userProfile");
    localStorage.removeItem("access_token");
  }

  static currentUser() {
    const rawData = JSON.parse(localStorage.getItem("userProfile"));
    const data = {};
    if (!!rawData) {
      Object.keys(rawData).forEach(key => {
        const resultingKey = key.replace("_", "");
        data[resultingKey] = rawData[key];
      });
    }
    return new UserProfile(data);
  }

  static empty() {
    return new UserProfile({});
  }

  toJson() {
    const result = {
      nickname: this.nickname,
      email: this.email,
      license: this._license,
      photoOwner: this.photoOwner,
      link: this.link,
      anonymous: this.anonymous,
    };
    return JSON.stringify(result);
  }

  get email() {
    return this._email;
  }

  get nickname() {
    return this._nickname;
  }

  get link() {
    return this._link;
  }

  get photoOwner() {
    return this._photoOwner;
  }

  get anonymous() {
    return this._anonymous;
  }

  get cc0() {
    return this._license === cc0LicenceName;
  }

  get admin() {
    return this._admin;
  }

  get emailVerified() {
    return this._emailVerified;
  }

  set cc0(value) {
    this._license = value ? cc0LicenceName : null;
  }

  set email(value) {
    this._email = value;
  }

  set nickname(value) {
    this._nickname = value;
  }

  set link(value) {
    this._link = value;
  }

  set photoOwner(value) {
    this._photoOwner = value;
  }

  set anonymous(value) {
    this._anonymous = value;
  }
}

export { UserProfile };
