<?php require_once "../php/i18n.php"; ?>
<!doctype html>
<html lang="<?php echo $i18n->getAppliedLang(); ?>">
<head>
    <?php
    require_once "../php/header.php";
    $reportProblem = L::reportProblem_reportProblem;
    $comment = L::reportProblem_comment;
    $commentInfo = L::reportProblem_commentInfo;
    $pleaseInsertComment = L::reportProblem_pleaseInsertComment;
    $latitude = L::reportProblem_latitude;
    $pleaseInsertLatitude = L::reportProblem_pleaseInsertLatitude;
    $longitude = L::reportProblem_longitude;
    $pleaseInsertLongitude = L::reportProblem_pleaseInsertLongitude;
    $pleaseSelectProblemType = L::reportProblem_pleaseSelectProblemType;
    $wrongLocation = L::reportProblem_wrongLocation;
    $wrongName = L::reportProblem_wrongName;
    $stationInactive = L::reportProblem_stationInactive;
    $stationActive = L::reportProblem_stationActive;
    $stationNonExistant = L::reportProblem_stationNonExistant;
    $wrongPhoto = L::reportProblem_wrongPhoto;
    $other = L::reportProblem_otherProblem;
    ?>

    <title><?php echo $reportProblem; ?> - RailwayStations</title>
</head>
<body>

<?php
require_once "../php/navbar.php";
navbar();
?>

<main role="main" class="col-12 col-md-9 col-xl-8 py-md-3 pl-md-5 bd-content">

    <h2 id="title-form"><?php echo $reportProblem; ?></h2>
    <form id="reportProblemForm" class="needs-validation" novalidate action="">
        <input id="stationId" name="stationId" type="hidden"/>
        <input id="countryCode" name="countryCode" type="hidden"/>
        <div class="form-group">
            <label for="inputProblemType"><?php echo $problemType; ?></label>
            <select class="custom-select" id="inputType" onchange="changeProblemType()" required>
                <option value="" selected><?php echo $pleaseSelectProblemType; ?></option>
                <option value="WRONG_LOCATION"><?php echo $wrongLocation; ?></option>
                <option value="WRONG_NAME"><?php echo $wrongName; ?></option>
                <option value="STATION_INACTIVE"><?php echo $stationInactive; ?></option>
                <option value="STATION_ACTIVE"><?php echo $stationActive; ?></option>
                <option value="STATION_NONEXISTENT"><?php echo $stationNonExistant; ?></option>
                <option value="WRONG_PHOTO"><?php echo $wrongPhoto; ?></option>
                <option value="OTHER"><?php echo $other; ?></option>
            </select>
        </div>
        <div class="form-group coords">
            <label for="inputLatitude"><?php echo $latitude; ?></label>
            <input name="latitude" type="text" class="form-control" id="inputLatitude">
            <div class="invalid-feedback">
                <?php echo $pleaseInsertLatitude; ?>
            </div>
        </div>
        <div class="form-group coords">
            <label for="inputLongitude"><?php echo $longitude; ?></label>
            <input name="longitude" type="text" class="form-control" id="inputLongitude">
            <div class="invalid-feedback">
                <?php echo $pleaseInsertLongitude; ?>
            </div>
        </div>
        <div class="form-group">
            <label for="inputComment"><?php echo $comment; ?></label>
            <input name="comment" type="text" class="form-control" id="inputComment"
                   placeholder="<?php echo $commentInfo; ?>" required>
            <div class="invalid-feedback">
                <?php echo $pleaseInsertComment; ?>
            </div>
        </div>
        <button id="reportProblemSubmit" type="submit" class="btn btn-warning mt-1"><?php echo $reportProblem; ?> <em class="fas fa-bullhorn"></em></button>
    </form>

</main>


<script src="js/reportProblem.js"></script>
</body>
</html>
