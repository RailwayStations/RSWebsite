<!doctype html>
<html lang="de-DE">
<head>
    <?php
    require_once "./header.php";
    $title = L::token_title;
    $info = L::token_info;
    $mobileInfo = L::token_mobileInfo;
    $happy = L::token_happy;
    ?>
    <title><?php echo $title; ?> - RailwayStations</title>
</head>
<body>

<?php
require_once "./navbar.php";
navbar();
?>

<main role="main" class="col-12 col-md-9 col-xl-8 py-md-3 pl-md-5 bd-content">

	<div class="alert alert-success" role="alert">
	  <h4 class="alert-heading"><?php echo $info; ?></b></h4>
	  <p><?php echo $mobileInfo; ?></p>
	  <hr>
	  <p class="mb-0"><?php echo $happy; ?></p>
	</div>

</main>

		<script src="js/jquery-3.4.1.min.js"></script>
		<script src="js/popper.min.js"></script>
		<script src="bootstrap-4.3.1-dist/js/bootstrap.bundle.min.js"></script>

		<script src="js/common.js"></script>
		<script src="js/uploadtoken.js"></script>
  </body>
</html>
