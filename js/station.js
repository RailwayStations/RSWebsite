import { navigate, timetable, providerApp, initRSAPI, } from "./common";
import $ from "jquery";

window.navigate = navigate;
window.timetable = timetable;
window.providerApp = providerApp;

$(function() {
  initRSAPI().then(function() {
    console.log("RSAPI initialized");
  });
});