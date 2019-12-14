<!doctype html>
<html lang="de-DE">
  <head>

      <?php require_once __DIR__ . "/header.php" ?>
      
      <title>RailwayStations</title>

      <link rel="stylesheet" href="css/leaflet.css" />
      <link rel="stylesheet" href="css/MarkerCluster.css" />
      <link rel="stylesheet" href="css/MarkerCluster.Default.css">

  </head>
<body>

<?php
require_once __DIR__ . "/navbar.php";
$prefixNavItems = <<<HTML
    <li class="nav-item dropdown active">
        <a class="nav-link dropdown-toggle" href="#" id="country" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Land</a>
        <div class="dropdown-menu" id="countries" aria-labelledby="country">
        </div>
    </li>
    <li class="nav-item" id="location_watch_toggle">
        <a class="nav-link p-2" href="javascript:toggleLocation();" rel="noopener" aria-label="Mein Standort" title="Mein Standort"><i class="fas fa-search-location"></i></a>
    </li>
HTML;

$additionalItems = <<<HTML
    <form class="form-inline my-2 my-lg-0 order-sm-0 order-md-1">
        <input class="form-control mr-sm-2" type="text" placeholder="Finde deinen Bahnhof" aria-label="Suche" id="suche">
    </form>
HTML;

$suffixNavItems = <<<HTML
    <li class="nav-item">
        <a class="nav-link p-2" href="javascript:showHighScore();" rel="noopener" aria-label="Rangliste" title="Rangliste"><i class="fas fa-chart-line"></i></a>
    </li>
HTML;
navbar($suffixNavItems, $prefixNavItems, $additionalItems, '#');
?>

<main role="main" class="container-fluid h-100 p-0 m-0">
    <div id="map" style="width: 100%; height: 100%"></div>
</main>


<div class="modal fade" id="highscore" tabindex="-1" role="dialog" aria-labelledby="Rangliste" aria-hidden="true">
  <div class="modal-dialog modal-dialog-scrollable" role="document">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="highscoreLabel">Rangliste</h5>
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

<script src="js/jquery-3.4.1.min.js"></script>
<script src="js/jquery.autocomplete.js"></script>
<script src="js/popper.min.js"></script>
<script src="bootstrap-4.3.1-dist/js/bootstrap.bundle.min.js"></script>

<script src="js/leaflet.js"></script>
<script src="js/spin.js"></script>
<script src="js/leaflet.spin.js"></script>
<script src="js/leaflet.markercluster.js"></script>

<script src="js/common.js"></script>
<script src="js/main.js"></script>

</body>
</html>
