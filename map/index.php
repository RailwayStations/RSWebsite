<!doctype html>
<html lang="de-DE">
<head>

    <?php require_once "./header.php"; ?>

    <title>RailwayStations</title>

    <link rel="stylesheet" href="css/map.css"/>

</head>
<body>

<?php
require_once "./navbar.php";
$country = L::index_country;
$findStation = L::index_findStation;
$search = L::index_search;
$myLocation = L::index_myLocation;
$highscore = L::index_highscore;

$prefixNavItems = <<<HTML
    <li class="nav-item dropdown active">
        <a class="nav-link dropdown-toggle" href="#" id="country" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{$country}</a>
        <div class="dropdown-menu" id="countries" aria-labelledby="country">
        </div>
    </li>
    <li class="nav-item" id="location_watch_toggle">
        <a class="nav-link p-2" href="javascript:map.toggleLocation();" rel="noopener" aria-label="{$myLocation}" title="{$myLocation}"><em class="fas fa-search-location"></em></a>
    </li>
HTML;

$additionalItems = <<<HTML
    <form class="form-inline my-2 my-lg-0 order-sm-0 order-md-1">
        <input class="form-control mr-sm-2" type="text" placeholder="{$findStation}" aria-label="{$search}" id="suche">
    </form>
HTML;

$suffixNavItems = <<<HTML
    <li class="nav-item">
        <a class="nav-link p-2" href="javascript:map.showHighScore();" rel="noopener" aria-label="{$highscore}" title="{$highscore}"><em class="fas fa-chart-line"></em></a>
    </li>
HTML;
navbar($suffixNavItems, $prefixNavItems, $additionalItems, '#');
?>

<main role="main" class="container-fluid h-100 p-0 m-0">
    <div id="map" style="width: 100%; height: 100%"></div>
</main>


<div class="modal fade" id="highscore" tabindex="-1" role="dialog" aria-labelledby="<?php echo $highscore; ?>"
     aria-hidden="true">
    <div class="modal-dialog modal-dialog-scrollable" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="highscoreLabel"><?php echo $highscore; ?></h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="modal-body" id="highscoreBody">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
            </div>
        </div>
    </div>
</div>

<script src="js/map.js"></script>

</body>
</html>
