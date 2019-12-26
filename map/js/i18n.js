var getJSON = function() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "js/langJson.php", false);
  // xhr.responseType = 'json';
  xhr.onload = function() {
    window.i18n = JSON.parse(xhr.response);
  };
  xhr.send();
};

getJSON();
