$(document).ready(function() {
  "use strict";
  var vars = getQueryParameter();
  var uploadToken = vars.uploadToken;
  var userProfile = getUserProfile();

  if (uploadToken && uploadToken.length > 0) {
    userProfile.password = uploadToken;
    delete userProfile.uploadToken;
    setUserProfile(userProfile);
  }
});
