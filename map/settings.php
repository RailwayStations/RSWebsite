<!doctype html>
<html lang="de-DE">
<head>
    <meta name="description" content="Einstellungen - RailwayStations">
    <title>Einstellungen - RailwayStations</title>
    <?php require_once "./header.php" ?>

</head>
<body>

<?php
require_once "./navbar.php";
navbar();
?>

<main role="main" class="col-12 col-md-9 col-xl-8 py-md-3 pl-md-5 bd-content">

		<h2 id="title-form">Benutzerprofil</h2>
		<form id="profileForm" action="#" method="post">
			<input name="profilePassword" type="hidden" class="form-control" id="profilePassword">
			
			<div class="form-group login-form">
				<label for="loginEmail">Nickname oder Email</label>
				<input name="loginEmail" type="text" class="form-control" id="loginEmail">
			</div>
			<div class="form-group login-form">
				<label for="loginPassword">Passwort oder Upload-Token</label>
				<input name="loginPassword" type="password" class="form-control" id="loginPassword">
			</div>
			<div class="form-group login-form">
				<button id="loginButton" name="loginBtn" class="btn btn-primary" onclick="return onLogin();">Login</button>&nbsp;<button id="resetPasswordButton" name="resetPasswordBtn" class="btn btn-primary" onclick="return onResetPassword();">Passwort zurücksetzen</button>
				<p class="name"><a href="javascript:onNewRegistration();">Neu Registrieren</a></p>
			</div>
	
			<div class="form-group profile-form">
				<label for="profileNickname">Nickname</label>
				<input name="profileNickname" type="text" class="form-control" id="profileNickname">
			</div>
			<div class="form-group profile-form">
				<label for="profileEmail">Email</label>
				<input name="profileEmail" type="text" class="form-control" id="profileEmail">
			</div>
			<div class="form-group form-check profile-form">
				<input id="profilePhotoOwner" name="photoOwner" type="checkbox"/>
				<label for="profilePhotoOwner">Eigene Fotos</label>
			</div>
			<div class="form-group form-check profile-form">
				<input id="profileCc0" name="cc0" type="checkbox"/>
				<label for="profileCc0">Lizenz CC0</label>
			</div>
			<div class="form-group form-check profile-form">
				<input id="profileAnonymous" name="anonymous" type="checkbox"/>
				<label for="profileAnonymous">Anonym</label>
			</div>					
			<div class="form-group profile-form">
				<label for="profileLink">Dein Link</label>
				<input id="profileLink" name="link" type="url" class="form-control"/>
			</div>
			<div class="form-group profile-form">
				<button class="btn btn-primary" id="saveProfile" type="button" name="saveBtn" onclick="return onSaveProfile();">
					<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
					<span id="saveBtnText">Speichern / Registrieren</span>
				</button>				
			</div>
			<div class="form-group profile-form logged-in">
				<button id="changePassword" class="btn btn-primary" name="changePwdBtn" onclick="return onChangePassword();">Passwort ändern</button>
				&nbsp;
				<button id="logout" class="btn btn-primary" name="logoutBtn" onclick="return onLogout();">Logout</button>
			</div>
	
		</form>

				<hr/>

				<h2 id="title-form">Karteneinstellungen</h2>
				<p class="name"><a href="#" onclick="togglePoints()"><span style="padding:0 1em 0 0;text-align:right;width:7em;text-decoration-line:none;">Marker</span><i id="togglePoints" class="fas fa-2x" aria-hidden="true"></i><span style="padding:0 0 0 1em;text-align:right;width:7em;text-decoration-line:none;">Punkte</span></a></p>

</main>


<div class="modal fade" id="changePasswordModal" tabindex="-1" role="dialog" aria-labelledby="Rangliste" aria-hidden="true">
	<div class="modal-dialog modal-dialog-scrollable" role="document">
		<div class="modal-content">
		<div class="modal-header">
			<h5 class="modal-title" id="changePasswordLabel">Passwort ändern</h5>
			<button type="button" class="close" data-dismiss="modal" aria-label="Close">
			<span aria-hidden="true">&times;</span>
			</button>
		</div>
		<form action="#" onsubmit="return changePassword();">
			<div class="modal-body" id="changePasswordBody">
				<div class="form-group">
					<label for="newPassword">Passwort:</label>
					<input id="newPassword" class="form-control" name="newPassword" type="password" />
				</div>				
				<div class="form-group">
					<label for="newPasswordRepeat">Wiederholen:</label>
					<input id="newPasswordRepeat" class="form-control" name="newPasswordRepeat" type="password" />
				</div>				
			</div>
			<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-dismiss="modal">Schließen</button>
					<button type="submit" class="btn btn-primary">Ok</button>
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
