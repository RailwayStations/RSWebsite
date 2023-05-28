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
$errorPhotoNotFound = L::station_errorPhotoNotFound;
$previousPhoto = L::station_previousPhoto;
$nextPhoto = L::station_nextPhoto;
$reportProblem = L::station_reportProblem;

// Read config JSON file
$configFile = file_get_contents("./json/config.json");

// Decode the JSON file
$config = json_decode($configFile, true);

$stationId = trim(
    filter_input(INPUT_GET, "stationId", FILTER_SANITIZE_FULL_SPECIAL_CHARS)
);
$countryCode = trim(
    filter_input(INPUT_GET, "countryCode", FILTER_SANITIZE_FULL_SPECIAL_CHARS)
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
                    FILTER_SANITIZE_FULL_SPECIAL_CHARS
                ),
        ],
    ];

    $context = stream_context_create($opts);

    $curl = curl_init(
        $config["apiurl"] .
            "photoStationById/" .
            $countryCode .
            "/" .
            $stationId
    );
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    $json = curl_exec($curl);
    $responseCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    if ($responseCode == 200 && $json !== false) {
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
            $active =
                !property_exists($station, "inactive") || !$station->inactive;
            $uploadUrl =
                "upload.php?countryCode=" .
                $countryCode .
                "&stationId=" .
                $stationId .
                "&title=" .
                $stationName;

            if (isset($photoId)) {
                foreach ($station->photos as $photo) {
                    if ($photoId == $photo->id) {
                        $stationPhoto = $photoBaseUrl . $photo->path;
                        break;
                    }
                }
                if (!isset($stationPhoto)) {
                    $photoId = null;
                    $error = $errorPhotoNotFound;
                }
            }

            if (!isset($stationPhoto)) {
                foreach ($station->photos as $photo) {
                    $stationPhoto = $photoBaseUrl . $photo->path;
                    break;
                }
            }

            if (!isset($stationPhoto)) {
                $stationPhoto = "images/default.jpg";
            }
        }
    } elseif ($responseCode != 404) {
        if ($responseCode > 0) {
            $error = $errorLoadingStation . ": " . $responseCode;
        } else {
            $error = $errorLoadingStation . ": " . curl_error($curl);
        }
    }
    curl_close($curl);
} catch (Exception $e) {
    $error = $errorLoadingStation . ": " . $e;
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
        <a class="nav-link p-2" href="index.php?countryCode={$countryCode}&mlat={$lat}&mlon={$lon}&zoom=18&layers=M" rel="noopener" aria-label="{$showOnMap}" title="{$showOnMap}"><i class="fas fa-map"></i></a>
    </li>
    <li class="nav-item">
        <a class="nav-link p-2" href="#" onclick="navigate({$lat},{$lon});" rel="noopener" aria-label="{$navigate}" title="{$navigate}"><i class="fas fa-directions"></i></a>
    </li>
    <li class="nav-item">
        <a class="nav-link p-2" href="#" onclick="timetable('{$countryCode}','{$stationId}','{$stationName}', '{$ds100Html}');" rel="noopener" aria-label="{$departure}" title="{$departure}"><i class="fas fa-list"></i></a>
    </li>
    <li class="nav-item">
        <a class="nav-link p-2" href="#" onclick="providerApp('{$countryCode}');" rel="noopener" aria-label="{$app}" title="{$app}"><i class="fas fa-external-link-alt"></i></a>
    </li>
HTML;
navbar($suffixNavItems);
?>

<main role="main" class="col-12 bd-content station container">

    <?php if (isset($error)) { ?>
        <div id="error" class="alert alert-danger"> <?php echo $error; ?></div>
    <?php } ?>

    <h2><?= htmlspecialchars($stationName) ?></h2>
    <?php if (!$active) { ?>
        <div><i class="fas fa-times-circle"></i> <?php echo $inactive; ?>!</div>
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
) ?>"><i class="fas fa-bullhorn"></i> </a>
    <?php if (
        isset($photo->outdated) &&
        $photo->outdated
    ) { ?> <i class="fas fa-times-circle" title="<?php echo $photoOutdated; ?>!"></i><?php } ?>
</p>
                    </div>
                </div>
            <?php
                }} ?>
        </div>
        <button class="carousel-control-prev" type="button" 
            data-bs-target="#carouselExampleCaptions" data-bs-slide="prev">
            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
            <span class="visually-hidden"><?= htmlspecialchars(
                $previousPhoto
            ) ?></span>
        </button>
        <button class="carousel-control-next" type="button" 
            data-bs-target="#carouselExampleCaptions" data-bs-slide="next">
            <span class="carousel-control-next-icon" aria-hidden="true"></span>
            <span class="visually-hidden"><?= htmlspecialchars(
                $nextPhoto
            ) ?></span>
        </button>
    </div>

    <p><a href="<?= htmlspecialchars(
        $uploadUrl
    ) ?>" title="<?php echo $uploadYourOwnPicture; ?>" data-ajax="false"><i
                        class="fas fa-upload"></i> <?php echo $uploadYourOwnPicture; ?></a></p>


</main>

<div class="modal fade" id="providerApps" tabindex="-1" role="dialog" aria-labelledby="Betreiber Apps"
     aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="providerAppsLabel"><?php echo $app; ?></h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
