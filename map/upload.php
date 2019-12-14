<!doctype html>
<html lang="de-DE">
<head>
    <title>Upload - RailwayStations</title>
    <?php require_once __DIR__ . "/header.php" ?>
</head>
<body>

<?php
require_once __DIR__ . "/navbar.php";
navbar();
?>

<main role="main" class="col-12 col-md-9 col-xl-8 py-md-3 pl-md-5 bd-content">

		<h2 id="title-form">Upload</h2>
		<form id="uploadForm" class="needs-validation" novalidate action="https://api.railway-stations.org/photoUpload" method="post" enctype="multipart/form-data" target="upload_target">
				<input id="email" name="email" type="hidden" />
				<input id="uploadToken" name="uploadToken" type="hidden" />
				<input id="stationId" name="stationId" type="hidden" />
				<input id="countryCode" name="countryCode" type="hidden" />
				<div class="form-group missing-station">
						<label for="inputStationTitle">Bahnhofsname</label>
						<input name="stationTitle" type="text" class="form-control" id="inputStationTitle" placeholder="Bahnhofsname" required>
						<div class="invalid-feedback">
								Bitte den Bahnhofsnamen angeben.
						</div>
				</div>
				<div class="form-group missing-station">
						<label for="inputLatitude">Latitude</label>
						<input name="latitude" type="text" class="form-control" id="inputLatitude" placeholder="Latitude" required>
						<div class="invalid-feedback">
								Bitte Latitude angeben.
						</div>
				</div>
				<div class="form-group missing-station">
						<label for="inputLongitude">Longitude</label>
						<input name="longitude" type="text" class="form-control" id="inputLongitude" placeholder="Longitude" required>
						<div class="invalid-feedback">
								Bitte Longitude angeben.
						</div>
				</div>
				<div class="form-group">
						<label for="inputComment">Kommentar</label>
						<input name="comment" type="text" class="form-control" id="inputComment" placeholder="Kommentar für das Team">
				</div>
				<div class="form-group">
					<div class="custom-file">
						<input type="file" name="file" class="custom-file-input" id="fileInput" disabled required>
						<label class="custom-file-label" for="fileInput">Wähle eine Datei</label>
						<div class="invalid-feedback">
								Bitte Datei auswählen.
						</div>
					</div>
				</div>
				<input id="uploadSubmit" type="submit" class="btn btn-primary mt-1" name="submitBtn" value="Hochladen" disabled/>
		</form>

		<iframe id="upload_target" name="upload_target" src="#" style="width:0;height:0;border:0px solid #fff;"></iframe>

</main>


<div class="modal" id="upload-process" tabindex="-1" role="dialog" data-backdrop="static">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Foto Upload läuft</h5>
      </div>
      <div class="modal-body">
				<div class="spinner-border" role="status">
				  <span class="sr-only">Loading...</span>
				</div>
      </div>
    </div>
  </div>
</div>

<script src="js/jquery-3.4.1.min.js"></script>
<script src="js/popper.min.js"></script>
<script src="bootstrap-4.3.1-dist/js/bootstrap.bundle.min.js"></script>

<script src="js/common.js"></script>
<script src="js/bs-custom-file-input.min.js"></script>
<script src="js/upload.js"></script>
</body>
</html>
