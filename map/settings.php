<?php require_once "../php/i18n.php"; ?>
<!doctype html>
<html lang="<?php echo $i18n->getAppliedLang(); ?>">
<head>
    <meta name="description" content="Einstellungen - RailwayStations">
    <title>Einstellungen - RailwayStations</title>
    <?php require_once "../php/header.php"; ?>
    <link rel="stylesheet" href="css/settings.css"/>

</head>
<body>

<?php
require_once "../php/navbar.php";
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
    <div id="loginForm" class="hidden">
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
            <button id="loginButton" name="loginBtn" class="btn btn-primary">
                <?php echo $login; ?>
            </button>
            <button id="resetPasswordButton" name="resetPasswordBtn" class="btn btn-primary">
                <?php echo $resetPassword; ?>
            </button>
            <button id="registerButton" class="btn btn-primary">
                <?php echo $register; ?>
            </button>
        </div>
    </div>
    <div id="profileForm" class="hidden">
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
            <button class="btn btn-primary" id="saveProfile" type="button">
                <span id="saveProfileSpinner" class="spinner-border spinner-border-sm hidden" role="status"
                      aria-hidden="true"></span>
                <span id="saveBtnText"><?php echo $saveRegister; ?></span>
            </button>
            <button id="changePassword" class="btn btn-primary" name="changePwdBtn">
                <?php echo $changePassword; ?>
            </button>
            <button id="logout" class="btn btn-primary" name="logoutBtn">
                <?php echo $logout; ?>
            </button>
        </div>
    </div>
    <div id="passwordChangeForm" class="hidden">
        <div class="form-group">
            <label for="newPassword"><?php echo $password; ?>:</label>
            <input id="newPassword" class="form-control" name="newPassword" type="password"/>
        </div>
        <div class="form-group">
            <label for="newPasswordRepeat"><?php echo $passwordRepeat; ?>:</label>
            <input id="newPasswordRepeat" class="form-control" name="newPasswordRepeat" type="password"/>
        </div>
        <div class="form-group profile-form">
            <button id="passwordChangeCancel" type="button" class="btn btn-secondary"
                    data-dismiss="modal"><?php echo $close; ?></button>
            <button id="passwordChangeSubmit" type="button" class="btn btn-primary"><?php echo $submit; ?></button>
        </div>
    </div>
    <hr/>
    <h2 id="title-form"><?php echo $mapSettings; ?></h2>
    <div id="togglePointsSetting" class="name">
        <span style="padding:0 1em 0 0;text-align:right;width:7em;text-decoration-line:none;">
            <?php echo $mapMarker; ?>
        </span>
        <i id="togglePoints" class="fas fa-2x" aria-hidden="true"></i>
        <span style="padding:0 0 0 1em;text-align:right;width:7em;text-decoration-line:none;">
            <?php echo $mapPoint; ?>
        </span>
    </div>

</main>


<script src="js/settings.js"></script>
</body>
</html>
