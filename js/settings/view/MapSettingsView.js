import { getBoolFromLocalStorage, 
         getTileServer, 
         setTileServer, 
         getTileServerMap,
         getPhotoFilter,
         setPhotoFilter,
         getActiveFilter,
         setActiveFilter
       } from "../../common";
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

    const tileServerSelect = document.getElementById("tileServer");
    const tileServer = getTileServer();
    const tileServerMap = getTileServerMap();
    Object.entries(tileServerMap).forEach(element => {
      const name = element[0];
      var option = document.createElement("option"); 
      option.setAttribute("value", name); 
      option.appendChild(document.createTextNode(name)); 
      if (name === tileServer) {
        option.setAttribute("selected", "selected");
      }
      tileServerSelect.appendChild(option);
    });

    tileServerSelect.addEventListener("change", () => {
      setTileServer(tileServerSelect.value);
    });

    const photoFilter = document.getElementById("photoFilter");
    photoFilter.value = getPhotoFilter();
    photoFilter.addEventListener("change", () => {
      setPhotoFilter(photoFilter.value);
    });

    const activeFilter = document.getElementById("activeFilter");
    activeFilter.value = getActiveFilter();
    activeFilter.addEventListener("change", () => {
      setActiveFilter(activeFilter.value)
    });
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
