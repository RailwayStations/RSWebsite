import { getI18n } from "../../i18n";
import { getAPIURI } from "../../common";
import { AbstractFormView } from "./AbstractFormView";

//////////////////////////////////////////////////////////////////////
// GENERAL HELPER FUNCTIONS

// Make a POST request and parse the response as JSON
function sendPostRequest(url, params, success, error) {
  const request = new XMLHttpRequest();
  request.open("POST", url, true);
  request.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded; charset=UTF-8"
  );
  request.onload = function () {
    let body = {};
    try {
      body = JSON.parse(request.response);
    } catch (e) {}

    if (request.status == 200) {
      success(request, body);
    } else {
      error(request, body);
    }
  };
  request.onerror = function () {
    error(request, {});
  };
  const body = Object.keys(params)
    .map(key => key + "=" + params[key])
    .join("&");
  request.send(body);
}

function generateRandomString() {
  const array = new Uint32Array(28);
  window.crypto.getRandomValues(array);
  return Array.from(array, dec => ("0" + dec.toString(16)).slice(-2)).join("");
}

// Calculate the SHA256 hash of the input text.
// Returns a promise that resolves to an ArrayBuffer
function sha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
}

// Base64-urlencodes the input string
function base64urlencode(str) {
  // Convert the ArrayBuffer to string using Uint8 array to conver to what btoa accepts.
  // btoa accepts chars only within ascii 0-255 and base64 encodes them.
  // Then convert the base64 encoded to base64url encoded
  //   (replace + with -, replace / with _, trim trailing =)
  return window
    .btoa(String.fromCharCode.apply(null, new Uint8Array(str)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

// Return the base64-urlencoded sha256 hash for the PKCE challenge
async function pkceChallengeFromVerifier(v) {
  const hashed = await sha256(v);
  return base64urlencode(hashed);
}

class LoginView extends AbstractFormView {
  static load() {
    const loginForm = document.getElementById("loginForm");
    loginForm.classList.remove("hidden");
    document
      .getElementById("loginButton")
      .addEventListener("click", async function (e) {
        e.preventDefault();

        // Create and store a random "state" value
        const state = generateRandomString();
        localStorage.setItem("pkce_state", state);

        // Create and store a new PKCE code_verifier (the plaintext random secret)
        const code_verifier = generateRandomString();
        localStorage.setItem("pkce_code_verifier", code_verifier);

        // Hash and base64-urlencode the secret to use as the challenge
        const codeChallenge = await pkceChallengeFromVerifier(code_verifier);

        location.href =
          getAPIURI() +
          "oauth2/authorize?client_id=" +
          encodeURIComponent(process.env.CLIENT_ID) +
          "&scope=all&response_type=code&code_challenge=" +
          encodeURIComponent(codeChallenge) +
          "&code_challenge_method=S256&redirect_uri=" +
          encodeURIComponent(process.env.REDIRECT_URI) +
          "&state=" +
          encodeURIComponent(state);
      });
  }

  //////////////////////////////////////////////////////////////////////
  // OAUTH REDIRECT HANDLING
  // Handle the redirect back from the authorization server and
  // get an access token from the token endpoint
  static handleAuthorizationCallback(q) {
    // If the server returned an authorization code, attempt to exchange it for an access token
    if (q.code) {
      // Verify state matches what we set at the beginning
      if (localStorage.getItem("pkce_state") != q.state) {
        localStorage.removeItem("access_token");
        this.showError(getI18n(s => s.settings.invalidState));
        return false;
      } else {
        // Exchange the authorization code for an access token
        sendPostRequest(
          getAPIURI() + "oauth2/token",
          {
            grant_type: "authorization_code",
            code: q.code,
            client_id: process.env.CLIENT_ID,
            redirect_uri: process.env.REDIRECT_URI,
            code_verifier: localStorage.getItem("pkce_code_verifier"),
          },
          function (request, body) {
            localStorage.setItem("access_token", body.access_token);
            location.href = "settings.php";
          },
          function (request, error) {
            location.href = "settings.php?error=" + error.error;
          }
        );
      }

      // Clean these up since we don't need them anymore
      localStorage.removeItem("pkce_state");
      localStorage.removeItem("pkce_code_verifier");
      return true;
    }

    return false;
  }
}

export { LoginView };
