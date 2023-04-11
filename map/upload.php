<?php require_once "../php/i18n.php"; ?>
<!doctype html>
<html lang="<?php echo $i18n->getAppliedLang(); ?>">
<head>
    <?php
    require_once "../php/header.php";
    $stationName = L::upload_stationName;
    $pleaseInsertStationName = L::upload_pleaseInsertStationName;
    $latitude = L::upload_latitude;
    $pleaseInsertLatitude = L::upload_pleaseInsertLatitude;
    $longitude = L::upload_longitude;
    $pleaseInsertLongitude = L::upload_pleaseInsertLongitude;
    $comment = L::upload_comment;
    $commentInfo = L::upload_commentInfo;
    $fileChooser = L::upload_fileChooser;
    $pleaseInsertFile = L::upload_pleaseInsertFile;
    $pleaseInsertComment = L::upload_pleaseInsertComment;
    $upload = L::upload_upload;
    $reportMissingStation = L::upload_reportMissingStation;
    $uploadRunning = L::upload_uploadRunning;
    $loading = L::upload_loading;
    $freedomOfPanorama = L::upload_freedomOfPanorama;
    $freedomOfPanoramaInfo = L::upload_freedomOfPanoramaInfo;
    $pleaseConfirmSpecialLicense = L::upload_pleaseConfirmSpecialLicense;
    $active = L::upload_active;
    $pleaseSelectActiveFlag = L::upload_pleaseSelectActiveFlag;
    $active_yes = L::upload_active_yes;
    $active_no = L::upload_active_no;
    $photoRequirements = L::upload_photoRequirements;
    $country = L::upload_country;
    ?>

    <title><?php echo $upload; ?> - RailwayStations</title>
</head>
<body>

<?php
require_once "../php/navbar.php";
navbar();
?>

<main role="main" class="col-12 col-md-9 col-xl-8 py-md-3 pl-md-5 bd-content container">

    <div id="error" class="alert alert-danger hidden"></div>
    <div id="success" class="alert alert-success hidden"></div>

    <h2 id="title-form"><?php echo $reportMissingStation; ?></h2>
    <form id="uploadForm" class="needs-validation" novalidate
          method="post" enctype="multipart/form-data">
        <input id="stationId" name="stationId" type="hidden"/>
        <input id="countryCode" name="countryCode" type="hidden"/>
        <div class="form-group missing-station">
            <label for="inputStationTitle"><?php echo $stationName; ?></label>
            <input name="stationTitle" type="text" class="form-control" id="inputStationTitle"
                   placeholder="<?php echo $stationName; ?>" required>
            <div class="invalid-feedback">
                <?php echo $pleaseInsertStationName; ?>
            </div>
        </div>
        <div class="form-group missing-station">
            <label for="inputLatitude"><?php echo $latitude; ?></label>
            <input name="latitude" type="text" class="form-control" id="inputLatitude"
                   placeholder="<?php echo $latitude; ?>" required>
            <div class="invalid-feedback">
                <?php echo $pleaseInsertLatitude; ?>
            </div>
        </div>
        <div class="form-group missing-station">
            <label for="inputLongitude"><?php echo $longitude; ?></label>
            <input name="longitude" type="text" class="form-control" id="inputLongitude"
                   placeholder="<?php echo $longitude; ?>" required>
            <div class="invalid-feedback">
                <?php echo $pleaseInsertLongitude; ?>
            </div>
        </div>
        <div class="form-group missing-station">
            <label for="countrySelect"><?php echo $country; ?></label>
            <select class="form-control" id="countrySelect">
            </select>
        </div>
        <div class="form-group missing-station">
            <label for="active"><?php echo $active; ?></label>
            <select class="form-control" id="active" name="active" required>
                <option value="" selected><?php echo $pleaseSelectActiveFlag; ?></option>
                <option value="true"><?php echo $active_yes; ?></option>
                <option value="false"><?php echo $active_no; ?></option>
            </select>
            <div class="invalid-feedback">
                <?php echo $pleaseSelectActiveFlag; ?>
            </div>
        </div>
        <div class="form-group">
            <label for="inputComment"><?php echo $comment; ?></label>
            <input name="comment" type="text" class="form-control" id="inputComment"
                   placeholder="<?php echo $commentInfo; ?>">
            <div class="invalid-feedback">
                <?php echo $pleaseInsertComment; ?>
            </div>
        </div>
        <div class="form-group">
            <div class="custom-file">
                <input type="file" name="file" class="custom-file-input" id="fileInput" required>
                <label class="custom-file-label" for="fileInput"><?php echo $fileChooser; ?></label>
                <div class="invalid-feedback">
                    <?php echo $pleaseInsertFile; ?>
                </div>
            </div>
            <div id="photo-requirements"><?php echo $photoRequirements; ?></div>
        </div>
        <div class="form-group special-license-group">
            <input type="checkbox" name="special-license" class="special-license" id="specialLicense" value="" required>
            <label class="special-license-label" for="specialLicense" id="special-license-label"></label>
            <div class="invalid-feedback">
                <?php echo $pleaseConfirmSpecialLicense; ?>
            </div>
        </div>
        <button id="uploadSubmit" type="submit" class="btn btn-primary mt-1">
            <?php echo $upload; ?> <i class="fas fa-upload"></i>
        </button>
    </form>

    <div id="uploaded-photo-link"></div>

    <h3 id="freedom-of-panorama"><?php echo $freedomOfPanorama; ?></h3>
    <div id="freedom-of-panorama-info"><?php echo $freedomOfPanoramaInfo; ?></div>
</main>


<div class="modal" id="upload-process" tabindex="-1" role="dialog" data-backdrop="static">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title"><?php echo $uploadRunning; ?></h5>
            </div>
            <div class="modal-body">
                <div class="spinner-border" role="status">
                    <span class="sr-only"><?php echo $loading; ?></span>
                </div>
            </div>
        </div>
    </div>
</div>

<script src="js/upload.js"></script>
</body>
</html>
