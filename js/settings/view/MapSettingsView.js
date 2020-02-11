import { getBoolFromLocalStorage } from "../../common";
import $ from "jquery";

class MapSettingsView {
  static load() {
    const showPoints = getBoolFromLocalStorage("showPoints");
    const classList = document.getElementById("togglePoints").classList;
    if (showPoints) {
      classList.add("fa-toggle-on");
    } else {
      classList.add("fa-toggle-off");
    }

    document
      .getElementById("togglePointsSetting")
      .addEventListener("click", this.togglePointsMarker());
  }

  static togglePointsMarker() {
    return () => {
      const classList = document.getElementById("togglePoints").classList;
      classList.toggle("fa-toggle-on");
      classList.toggle("fa-toggle-off");
      const showPoints = classList.contains("fa-toggle-on");
      localStorage.setItem("showPoints", showPoints ? "true" : "false");
    };
  }
}

export { MapSettingsView };
