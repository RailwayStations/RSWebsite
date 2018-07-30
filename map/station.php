<?php
	$stationId = trim($_GET['stationId']);
	$countryCode = trim($_GET['countryCode']);
	$stationName = 'Station nicht gefunden';
	$stationPhoto = 'images/default.jpg';
	$photoCaption = $stationName;
	$photographer = 'n.a.';
	$photographerUrl = '';
	$license = 'n.a.';

	try {
		$json = file_get_contents('https://api.railway-stations.org/'.$countryCode.'/stations/'.$stationId);
		if ($json !== false) {
			$data = json_decode($json, true);
			if (isset($data)) {
				$stationName = $data['title'];
				$photographer = $data['photographer'];
				if (isset($photographer)) {
					$stationPhoto = $data['photoUrl'];
					$photographerUrl = $data['photographerUrl'];
					$license = $data['license'];
					$photoCaption = $stationName;
				} else {
					$photoCaption = 'Hier fehlt noch ein Foto';
					$photographer = 'n.a.';
				}
			}
		}
	} catch (Exception $e) {
	    $photoCaption = 'Fehler beim Laden der Station';
	}

?>
<!DOCTYPE html>
<!--[if lt IE 7]>      <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="de-DE"> <![endif]-->
<!--[if IE 7]>         <html class="no-js lt-ie9 lt-ie8" lang="de-DE"> <![endif]-->
<!--[if IE 8]>         <html class="no-js lt-ie9" lang="de-DE"> <![endif]-->
<!--[if gt IE 8]><!--> <html class="no-js" lang="de-DE" xmlns="http://www.w3.org/1999/xhtml"
      xmlns:fb="http://ogp.me/ns/fb#"> <!--<![endif]-->
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta property="og:image" content="<?php echo $stationPhoto;?>" />
	<title><?php echo $stationName;?> - RailwayStations</title>

	<link rel="apple-touch-icon" sizes="57x57" href="./images/apple-icon-57x57.png">
	<link rel="apple-touch-icon" sizes="60x60" href="./images/apple-icon-60x60.png">
	<link rel="apple-touch-icon" sizes="72x72" href="./images/apple-icon-72x72.png">
	<link rel="apple-touch-icon" sizes="76x76" href="./images/apple-icon-76x76.png">
	<link rel="apple-touch-icon" sizes="114x114" href="./images/apple-icon-114x114.png">
	<link rel="apple-touch-icon" sizes="120x120" href="./images/apple-icon-120x120.png">
	<link rel="apple-touch-icon" sizes="144x144" href="./images/apple-icon-144x144.png">
	<link rel="apple-touch-icon" sizes="152x152" href="./images/apple-icon-152x152.png">
	<link rel="apple-touch-icon" sizes="180x180" href="./images/apple-icon-180x180.png">
	<link rel="icon" type="image/png" sizes="192x192"  href="./images/android-icon-192x192.png">
	<link rel="icon" type="image/png" sizes="32x32" href="./images/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="96x96" href="./images/favicon-96x96.png">
	<link rel="icon" type="image/png" sizes="16x16" href="./images/favicon-16x16.png">
	<meta name="msapplication-TileColor" content="#ffffff">
	<meta name="msapplication-TileImage" content="./images/ms-icon-144x144.png">
	<meta name="theme-color" content="#ffffff">

	<link rel="stylesheet" type="text/css" href="css/style.css"/>
  <link href='https://fonts.googleapis.com/css?family=Raleway:400,200,300,600,700,800' rel='stylesheet' type='text/css'>
	<link href='https://fonts.googleapis.com/css?family=Open+Sans:400,700,800,600,300,200' rel='stylesheet' type='text/css'>
	<link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" rel="stylesheet">
	<link href="css/responsive.css" rel="stylesheet" media="screen" type="text/css"/>
	<link href='https://fonts.googleapis.com/css?family=Open+Sans:400,700,800,300' rel='stylesheet' type='text/css'>
	<script src="https://code.jquery.com/jquery-1.11.1.min.js"></script>
	<script src="js/common.js"></script>

</head>
<body>
    <header id="top" class="header" role="banner">
        <div class="container clearfix">
    		<div class="logo-menu">
        		<div class="logo clearfix">
							<img src="images/logo.jpg">
							<h1><a href="index.html">Railway<strong>Stations</strong></a></h1>
              <div id="station-name"><?php echo $stationName;?></div>
						</div>
			  </div>
				<nav id="nav" class="site-navigation primary-navigation" role="navigation">
					<ul class="nav-menu">
							<li><a href="impressum.html" class="localLink">Impressum</a></li>
					</ul>
				</nav>
		    </div>
    </header>

    <section id="main" class="container detail clearfix">
			<div>
				<img id="station-photo" src="<?php echo $stationPhoto;?>" title="<?php echo $photoCaption;?>"/>
				<div id="photo-caption">Fotograf: <a href="<?php echo $photographerUrl;?>" id="photographer-url"><span id="photographer"><?php echo $photographer;?></span></a>, Lizenz: <span id="license"><?php echo $license;?></span></div>
			</div>
    </section>
  </body>
</html>
