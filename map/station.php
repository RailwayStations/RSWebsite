<?php
require_once "../php/i18n.php";

$navigate = L::station_navigate;
$showOnMap = L::station_showOnMap;
$departure = L::station_departure;
$app = L::station_app;
$inactive = L::station_inactive;
$photoOutdated = L::station_photoOutdated;
$photoBy = L::station_photoBy;
$uploadYourOwnPicture = L::station_uploadYourOwnPicture;
$stationNotFound = L::station_notFound;
$photoMissing = L::station_photoMissing;
$errorLoadingStation = L::station_errorLoadingStation;
$previousPhoto = L::station_previousPhoto;
$nextPhoto = L::station_nextPhoto;
$reportProblem = L::station_reportProblem;

// Read config JSON file
$configFile = file_get_contents("./json/config.json");

// Decode the JSON file
$config = json_decode($configFile, true);

$stationId = trim(filter_input(INPUT_GET, "stationId", FILTER_SANITIZE_STRING));
$countryCode = trim(
    filter_input(INPUT_GET, "countryCode", FILTER_SANITIZE_STRING)
);
$photoId = filter_input(INPUT_GET, "photoId", FILTER_VALIDATE_INT);

$stationName = $stationNotFound;
$DS100 = "";
$lat = 0;
$lon = 0;
$uploadUrl = "";
$active = true;

try {
    $opts = [
        "http" => [
            "method" => "GET",
            "header" =>
                "Accept-language: " .
                filter_input(
                    INPUT_SERVER,
                    "SERVER_NAME",
                    FILTER_SANITIZE_STRING
                ),
        ],
    ];

    $context = stream_context_create($opts);

    $json = file_get_contents(
        $config["apiurl"] .
            "photoStationById/" .
            $countryCode .
            "/" .
            $stationId,
        false,
        $context
    );
    if ($json !== false) {
        $data = json_decode($json);
        if (isset($data)) {
            $photoBaseUrl = $data->photoBaseUrl;
            $licenses = $data->licenses;
            $photographers = $data->photographers;
            $station = $data->stations[0];

            $stationName = $station->title;
            $DS100 = $station->shortCode;
            $lat = $station->lat;
            $lon = $station->lon;
            $active = !$station->inactive;
            $uploadUrl =
                "upload.php?countryCode=" .
                $countryCode .
                "&stationId=" .
                $stationId .
                "&title=" .
                $stationName;

            foreach ($station->photos as $photo) {
                if (
                    (isset($photoId) && $photoId == $photo->id) ||
                    (!isset($photoId) && !isset($stationPhoto))
                ) {
                    $stationPhoto = $photoBaseUrl . $photo->path;
                }
            }

            if (!isset($stationPhoto)) {
                $stationPhoto = "images/default.jpg";
            }
        }
    }
} catch (Exception $e) {
    $error = $errorLoadingStation;
}
?>
<!doctype html>
<html lang="<?php echo $i18n->getAppliedLang(); ?>">
<head>
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="og:title" content="<?= htmlspecialchars(
        $stationName
    ) ?> - RailwayStations"></meta>
    <meta property="og:image" content="<?= htmlspecialchars($stationPhoto) ?>"/>
    <title><?= htmlspecialchars($stationName) ?> - RailwayStations</title>
    <?php require_once "../php/header.php"; ?>
</head>
<body>

<?php
require_once "../php/navbar.php";
$ds100Html = htmlspecialchars($DS100);

$suffixNavItems = <<<HTML
    <li class="nav-item">
        <a class="nav-link p-2" href="index.php?countryCode={$countryCode}&mlat={$lat}&mlon={$lon}&zoom=18&layers=M" rel="noopener" aria-label="{$showOnMap}" title="{$showOnMap}"><em class="fas fa-map"></em></a>
    </li>
    <li class="nav-item">
        <a class="nav-link p-2" href="#" onclick="navigate({$lat},{$lon});" rel="noopener" aria-label="{$navigate}" title="{$navigate}"><em class="fas fa-directions"></em></a>
    </li>
    <li class="nav-item">
        <a class="nav-link p-2" href="#" onclick="timetable('{$countryCode}','{$stationId}','{$stationName}', '{$ds100Html}');" rel="noopener" aria-label="{$departure}" title="{$departure}"><em class="fas fa-list"></em></a>
    </li>
    <li class="nav-item">
        <a class="nav-link p-2" href="#" onclick="providerApp('{$countryCode}');" rel="noopener" aria-label="{$app}" title="{$app}"><em class="fas fa-external-link-alt"></em></a>
    </li>
HTML;
navbar($suffixNavItems);
?>

<main role="main" class="col-12 bd-content station container">

    <h2><?= htmlspecialchars($stationName) ?></h2>
    <?php if (!$active) { ?>
        <div><em class="fas fa-times-circle"></em> <?php echo $inactive; ?>!</div>
    <?php } ?>

    <div id="carouselExampleCaptions" class="carousel slide" data-bs-ride="false">
        <div class="carousel-inner" id="carousel-inner">
            <?php if (!isset($station) || count($station->photos) == 0) { ?>
                <div class="carousel-item active">
                    <img src="images/default.jpg" class="d-block w-100" alt="<?= htmlspecialchars(
                        $stationName
                    ) ?>">
                    <div class="carousel-caption d-none d-md-block">
                        <h5><?= htmlspecialchars($photoMissing) ?></h5>
                        <p></p>
                    </div>
                </div>
            <?php } else {$found = false;
                foreach ($station->photos as $photo) {

                    $active = "";
                    if (
                        (isset($photoId) && $photoId == $photo->id) ||
                        (!isset($photoId) && !$found)
                    ) {
                        $active = "active";
                        $found = true;
                    }

                    foreach ($photographers as $photographerMeta) {
                        if ($photographerMeta->name === $photo->photographer) {
                            $photographerUrl = $photographerMeta->url;
                        }
                    }

                    foreach ($licenses as $licensesMeta) {
                        if ($licensesMeta->id === $photo->license) {
                            $licenseName = $licensesMeta->name;
                            $licenseUrl = $licensesMeta->url;
                        }
                    }

                    $problemUrl =
                        "reportProblem.php?countryCode=" .
                        $countryCode .
                        "&stationId=" .
                        $stationId .
                        "&title=" .
                        $station->title .
                        "&photoId=" .
                        $photo->id;
                    ?> 
                <div class="carousel-item <?= $active ?>">
                    <img src="<?= htmlspecialchars(
                        $photoBaseUrl . $photo->path
                    ) ?>" class="d-block w-100" alt="<?= htmlspecialchars(
    $stationName
) ?>">
                    <div class="carousel-caption">
                        <p><?php echo $photoBy; ?>: <a href="<?= htmlspecialchars(
    $photographerUrl
) ?>" id="photographer-url"><span id="photographer"><?= htmlspecialchars(
    $photo->photographer
) ?></span></a> - <a href="<?= htmlspecialchars(
    $licenseUrl
) ?>" id="license-url"><span id="license"><?= htmlspecialchars(
    $licenseName
) ?></span></a>,       
    <a href="<?php echo $problemUrl; ?>" title="<?= htmlspecialchars(
    $reportProblem
) ?>"><em class="fas fa-bullhorn"></em></a>
    <?php if (
        $photo->outdated
    ) { ?> <em class="fas fa-times-circle" title="<?php echo $photoOutdated; ?>!"></em><?php } ?>
</p>
                    </div>
                </div>
            <?php
                }} ?>
        </div>
        <button class="carousel-control-prev" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden"><?= htmlspecialchars(
                $previousPhoto
            ) ?></span>
        </button>
        <button class="carousel-control-next" type="button" data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden"><?= htmlspecialchars(
                $nextPhoto
            ) ?></span>
        </button>
    </div>

    <p><a href="<?= htmlspecialchars(
        $uploadUrl
    ) ?>" title="<?php echo $uploadYourOwnPicture; ?>" data-ajax="false"><em
                        class="fas fa-upload"></em> <?php echo $uploadYourOwnPicture; ?></a></p>


</main>

<div class="modal fade" id="providerApps" tabindex="-1" role="dialog" aria-labelledby="Betreiber Apps"
     aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="providerAppsLabel"><?php echo $app; ?></h5>
                <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="providerAppsBody">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<script src="js/station.js"></script>
</body>
</html>
