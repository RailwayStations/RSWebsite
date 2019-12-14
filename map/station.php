<?php
	$stationId = trim($_GET['stationId']);
	$countryCode = trim($_GET['countryCode']);
	$stationName = 'Station nicht gefunden';
	$stationPhoto = 'images/default.jpg';
	$photoCaption = $stationName;
	$DS100 = "";
	$lat = 0;
	$lon = 0;
	$photographer = 'n.a.';
	$photographerUrl = '';
	$license = 'n.a.';
	$licenseUrl = '';
	$uploadUrl = '';
	$active = true;

	try {
		$opts = [
			"http" => [
				"method" => "GET",
				"header" => "Accept-language: " . $_SERVER['HTTP_ACCEPT_LANGUAGE']
			]
		];

		$context = stream_context_create($opts);

		$json = file_get_contents('https://api.railway-stations.org/'.$countryCode.'/stations/'.$stationId, false, $context);
		if ($json !== false) {
			$data = json_decode($json, true);
			if (isset($data)) {
				$stationName = $data['title'];
				$photographer = $data['photographer'];
				$photoCaption = $stationName;
				$DS100 = $data['DS100'];
				$lat = $data['lat'];
				$lon = $data['lon'];
				$active = $data['active'];
				if (isset($photographer)) {
					$stationPhoto = $data['photoUrl'];
					$photographerUrl = $data['photographerUrl'];
					$license = $data['license'];
					$licenseUrl = $data['licenseUrl'];
				} else {
					$photoCaption = 'Hier fehlt noch ein Foto';
					$photographer = 'n.a.';
					$uploadUrl = 'upload.php?countryCode='.$countryCode.'&stationId='.$stationId.'&title='.$stationName;
				}
			}
		}
	} catch (Exception $e) {
		$photoCaption = 'Fehler beim Laden der Station';
	}
?>
<!doctype html>
<html lang="de-DE" xmlns="http://www.w3.org/1999/xhtml" xmlns:fb="http://ogp.me/ns/fb#">
<head>
	<meta property="og:image" content="<?php echo htmlspecialchars($stationPhoto); ?>"/>
	<title><?php echo htmlspecialchars($stationName); ?> - RailwayStations</title>
	<?php require_once "./header.php" ?>
</head>
<body>

<?php
require_once "./navbar.php";
$ds100Html = htmlspecialchars($DS100);
$suffixNavItems = <<<HTML
	<li class="nav-item">
		<a class="nav-link p-2" href="#" onclick="navigate({$lat},{$lon});" rel="noopener" aria-label="Navigiere" title="Navigiere"><i class="fas fa-directions"></i></a>
	</li>
	<li class="nav-item">
		<a class="nav-link p-2" href="#" onclick="timetable('{$countryCode}','{$stationId}','{$stationName}', '{$ds100Html}');" rel="noopener" aria-label="Abfahrtszeiten" title="Abfahrtszeiten"><i class="fas fa-list"></i></a>
	</li>
	<li class="nav-item">
		<a class="nav-link p-2" href="#" onclick="providerApp('{$countryCode}');" rel="noopener" aria-label="Betreiber App" title="Betreiber App"><i class="fas fa-external-link-alt"></i></a>
	</li>
HTML;
navbar($suffixNavItems);
?>

<main role="main" class="col-12 bd-content station">

		<h2><?php echo htmlspecialchars($stationName);?></h2>
		<?php if (!$active) { ?>
		<div><i class="fas fa-times-circle"></i> Dieser Bahnhof ist nicht aktiv!</i></div>
		<?php } ?>

		<?php if ($uploadUrl == '') { ?>
					<p><small class=\"text-muted\">Fotograf: <a href="<?php echo htmlspecialchars($photographerUrl);?>" id="photographer-url"><span id="photographer"><?php echo htmlspecialchars($photographer);?></span></a>,
					Lizenz: <a href="<?php echo htmlspecialchars($licenseUrl);?>" id="license-url"><span id="license"><?php echo htmlspecialchars($license);?></span></a></small></p>
		<?php } else { ?>
					<p><a href="<?php echo htmlspecialchars($uploadUrl);?>" title="Eigenes Foto hochladen" data-ajax="false"><i class="fas fa-upload"></i> Lade Dein eigenes Foto hoch</i></a></p>
		<?php } ?>

		<img id="station-photo" class="img-fluid max-width: 100%;height: auto;" src="<?php echo htmlspecialchars($stationPhoto);?>" title="<?php echo htmlspecialchars($photoCaption);?>"/>

</main>

<div class="modal fade" id="providerApps" tabindex="-1" role="dialog" aria-labelledby="Betreiber Apps"
	 aria-hidden="true">
	<div class="modal-dialog modal-dialog-scrollable" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title" id="providerAppsLabel">Betreiber Apps</h5>
				<button type="button" class="close" data-dismiss="modal" aria-label="Close">
					<span aria-hidden="true">&times;</span>
				</button>
			</div>
			<div class="modal-body" id="providerAppsBody">
			</div>
			<div class="modal-footer">
				<button type="button" class="btn btn-primary" data-dismiss="modal">Close</button>
			</div>
		</div>
	</div>
</div>


<script src="js/jquery-3.4.1.min.js"></script>
<script src="js/popper.min.js"></script>
<script src="bootstrap-4.3.1-dist/js/bootstrap.bundle.min.js"></script>

<script src="js/common.js"></script>
</body>
</html>
