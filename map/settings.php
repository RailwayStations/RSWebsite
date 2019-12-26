<!doctype html>
<html lang="de-DE">
<head>
    <meta name="description" content="Einstellungen - RailwayStations">
    <title>Einstellungen - RailwayStations</title>
    <?php require_once "./header.php"; ?>

</head>
<body>

<?php
require_once "./navbar.php";
navbar();

$profile = L::settings_profile;
$nicknameOrEmail = L::settings_nicknameOrEmail;
$login = L::settings_login;
$resetPassword = L::settings_resetPassword;
$register = L::settings_register;
$nickname = L::settings_nickname;
$email = L::settings_email;
$ownPictures = L::settings_ownPictures;
$licenceCC0 = L::settings_licenceCC0;
$anonymous = L::settings_anonymous;
$yourLink = L::settings_yourLink;
$saveRegister = L::settings_saveRegister;
$changePassword = L::settings_changePassword;
$logout = L::settings_logout;
$mapSettings = L::settings_mapSettings;
$mapMarker = L::settings_mapMarker;
$mapPoint = L::settings_mapPoint;
$password = L::settings_password;
$passwordRepeat = L::settings_passwordRepeat;
$close = L::settings_close;
$submit = L::settings_submit;
?>

<main role="main" class="col-12 col-md-9 col-xl-8 py-md-3 pl-md-5 bd-content">

        <h2 id="title-form"><?php echo $profile; ?></h2>
        <form id="profileForm" action="#" method="post">
            <input name="profilePassword" type="hidden" class="form-control" id="profilePassword">
            
            <div class="form-group login-form">
                <label for="loginEmail"><?php echo $nicknameOrEmail; ?></label>
                <input name="loginEmail" type="text" class="form-control" id="loginEmail">
            </div>
            <div class="form-group login-form">
                <label for="loginPassword"><?php echo $password; ?></label>
                <input name="loginPassword" type="password" class="form-control" id="loginPassword">
            </div>
            <div class="form-group login-form">
                <button id="loginButton" name="loginBtn" class="btn btn-primary" onclick="return onLogin();"><?php echo $login; ?></button>&nbsp;<button id="resetPasswordButton" name="resetPasswordBtn" class="btn btn-primary" onclick="return onResetPassword();"><?php echo $resetPassword; ?></button>
                <p class="name"><a href="javascript:onNewRegistration();"><?php echo $register; ?></a></p>
            </div>
    
            <div class="form-group profile-form">
                <label for="profileNickname"><?php echo $nickname; ?></label>
                <input name="profileNickname" type="text" class="form-control" id="profileNickname">
            </div>
            <div class="form-group profile-form">
                <label for="profileEmail"><?php echo $email; ?></label>
                <input name="profileEmail" type="text" class="form-control" id="profileEmail">
            </div>
            <div class="form-group form-check profile-form">
                <input id="profilePhotoOwner" name="photoOwner" type="checkbox"/>
                <label for="profilePhotoOwner"><?php echo $ownPictures; ?></label>
            </div>
            <div class="form-group form-check profile-form">
                <input id="profileCc0" name="cc0" type="checkbox"/>
                <label for="profileCc0"><?php echo $licenceCC0; ?></label>
            </div>
            <div class="form-group form-check profile-form">
                <input id="profileAnonymous" name="anonymous" type="checkbox"/>
                <label for="profileAnonymous"><?php echo $anonymous; ?></label>
            </div>
            <div class="form-group profile-form">
                <label for="profileLink"><?php echo $yourLink; ?></label>
                <input id="profileLink" name="link" type="url" class="form-control"/>
            </div>
            <div class="form-group profile-form">
                <button class="btn btn-primary" id="saveProfile" type="button" name="saveBtn" onclick="return onSaveProfile();">
                    <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span id="saveBtnText"><?php echo $saveRegister; ?></span>
                </button>
            </div>
            <div class="form-group profile-form logged-in">
                <button id="changePassword" class="btn btn-primary" name="changePwdBtn" onclick="return onChangePassword();"><?php echo $changePassword; ?></button>
                &nbsp;
                <button id="logout" class="btn btn-primary" name="logoutBtn" onclick="return onLogout();"><?php echo $logout; ?></button>
            </div>
    
        </form>

                <hr/>

                <h2 id="title-form"><?php echo $mapSettings; ?></h2>
                <p class="name"><a href="#" onclick="togglePoints()"><span style="padding:0 1em 0 0;text-align:right;width:7em;text-decoration-line:none;"><?php echo $mapMarker; ?></span><i id="togglePoints" class="fas fa-2x" aria-hidden="true"></i><span style="padding:0 0 0 1em;text-align:right;width:7em;text-decoration-line:none;"><?php echo $mapPoint; ?></span></a></p>

</main>


<div class="modal fade" id="changePasswordModal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" role="document">
        <div class="modal-content">
        <div class="modal-header">
            <h5 class="modal-title" id="changePasswordLabel"><?php echo $changePassword; ?></h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
        </div>
        <form action="#" onsubmit="return changePassword();">
            <div class="modal-body" id="changePasswordBody">
                <div class="form-group">
                    <label for="newPassword"><?php echo $password; ?>:</label>
                    <input id="newPassword" class="form-control" name="newPassword" type="password" />
                </div>
                <div class="form-group">
                    <label for="newPasswordRepeat"><?php echo $passwordRepeat; ?>:</label>
                    <input id="newPasswordRepeat" class="form-control" name="newPasswordRepeat" type="password" />
                </div>
            </div>
            <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal"><?php echo $close; ?></button>
                    <button type="submit" class="btn btn-primary"><?php echo $submit; ?></button>
            </div>
        </form>
    </div>
</div>
      

<script src="js/jquery-3.4.1.min.js"></script>
<script src="js/popper.min.js"></script>
<script src="bootstrap-4.3.1-dist/js/bootstrap.bundle.min.js"></script>

<script src="js/common.js"></script>
<script src="js/settings.js"></script>
</body>
</html>
