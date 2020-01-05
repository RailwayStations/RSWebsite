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
    $upload = L::upload_upload;
    $uploadRunning = L::upload_uploadRunning;
    $loading = L::upload_loading;
    ?>

    <title><?php echo $upload; ?> - RailwayStations</title>
</head>
<body>

<?php
require_once "../php/navbar.php";
navbar();
?>

<main role="main" class="col-12 col-md-9 col-xl-8 py-md-3 pl-md-5 bd-content">

    <h2 id="title-form"><?php echo $upload; ?></h2>
    <form id="uploadForm" class="needs-validation" novalidate action="https://api.railway-stations.org/photoUpload"
          method="post" enctype="multipart/form-data" target="upload_target">
        <input id="email" name="email" type="hidden"/>
        <input id="uploadToken" name="uploadToken" type="hidden"/>
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
        <div class="form-group">
            <label for="inputComment"><?php echo $comment; ?></label>
            <input name="comment" type="text" class="form-control" id="inputComment"
                   placeholder="<?php echo $commentInfo; ?>">
        </div>
        <div class="form-group">
            <div class="custom-file">
                <input type="file" name="file" class="custom-file-input" id="fileInput" disabled required>
                <label class="custom-file-label" for="fileInput"><?php echo $fileChooser; ?></label>
                <div class="invalid-feedback">
                    <?php echo $pleaseInsertFile; ?>
                </div>
            </div>
        </div>
        <input id="uploadSubmit" type="submit" class="btn btn-primary mt-1" name="submitBtn"
               value="<?php echo $upload; ?>" disabled/>
    </form>

    <iframe id="upload_target" name="upload_target" src="#" style="width:0;height:0;border:0px solid #fff;"></iframe>

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
