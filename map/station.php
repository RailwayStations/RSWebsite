<?php
// Read config JSON file
$configFile = file_get_contents("./json/config.json");

// Decode the JSON file
$config = json_decode($configFile, true);

$stationId = trim(filter_input(INPUT_GET, "stationId", FILTER_SANITIZE_STRING));
$countryCode = trim(
    filter_input(INPUT_GET, "countryCode", FILTER_SANITIZE_STRING)
);
// TODO: use to select photo if more than one is present
$photoId = trim(filter_input(INPUT_GET, "photoId", FILTER_SANITIZE_STRING));
$stationName = "Station nicht gefunden";
$stationPhoto = "images/default.jpg";
$photoCaption = $stationName;
$DS100 = "";
$lat = 0;
$lon = 0;
$photographer = "n.a.";
$photographerUrl = "";
$license = "n.a.";
$licenseUrl = "";
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
        $config["apiurl"] . $countryCode . "/stations/" . $stationId,
        false,
        $context
    );
    if ($json !== false) {
        $data = json_decode($json, true);
        if (isset($data)) {
            $stationName = $data["title"];
            $photographer = $data["photographer"];
            $photoCaption = $stationName;
            $DS100 = $data["DS100"];
            $lat = $data["lat"];
            $lon = $data["lon"];
            $active = $data["active"];
            $outdated = $data["outdated"];
            $uploadUrl =
                "upload.php?countryCode=" .
                $countryCode .
                "&stationId=" .
                $stationId .
                "&title=" .
                $stationName;
            if (isset($photographer)) {
                // TODO: select the correct photo here via photoId
                $stationPhoto = $data["photoUrl"];
                $photographerUrl = $data["photographerUrl"];
                $license = $data["license"];
                $licenseUrl = $data["licenseUrl"];
            } else {
                $photoCaption = "Hier fehlt noch ein Foto";
                $photographer = "n.a.";
            }
        }
    }
} catch (Exception $e) {
    $photoCaption = "Fehler beim Laden der Station";
}
require_once "../php/i18n.php";
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

$navigate = L::station_navigate;
$showOnMap = L::station_showOnMap;
$departure = L::station_departure;
$app = L::station_app;
$inactive = L::station_inactive;
$photoOutdated = L::station_photoOutdated;
$i18nPhotographer = L::station_photographer;
$i18nLicense = L::station_license;
$uploadYourOwnPicture = L::station_uploadYourOwnPicture;

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
        <div><em class="fas fa-times-circle"></em><?php echo $inactive; ?>!</div>
    <?php } ?>
    <?php if ($outdated) { ?>
        <div><em class="fas fa-times-circle"></em><?php echo $photoOutdated; ?>!</div>
    <?php } ?>

    <p><small class="text-muted"><?php echo $i18nPhotographer; ?>: <a href="<?= htmlspecialchars(
    $photographerUrl
) ?>" id="photographer-url"><span id="photographer"><?= htmlspecialchars(
    $photographer
) ?></span></a>,
                        <?php echo $i18nLicense; ?>: <a href="<?= htmlspecialchars(
    $licenseUrl
) ?>" id="license-url"><span id="license"><?= htmlspecialchars(
    $license
) ?></span></a></small></p>

    <p><a href="<?= htmlspecialchars(
        $uploadUrl
    ) ?>" title="<?php echo $uploadYourOwnPicture; ?>" data-ajax="false"><em
                        class="fas fa-upload"></em> <?php echo $uploadYourOwnPicture; ?></a></p>

    <img id="station-photo" class="img-fluid max-width: 100%;height: auto;" src="<?= htmlspecialchars(
        $stationPhoto
    ) ?>" title="<?= htmlspecialchars(
    $photoCaption
) ?>" alt="<?= htmlspecialchars($photoCaption) ?>"/>

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
