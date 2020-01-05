<!doctype html>
<html lang="de-DE">
<head>
    <?php require_once "./header.php"; ?>
    <title><?php echo L::photographer_title; ?></title>
</head>
<body>

<?php
require_once "./navbar.php";
navbar();
?>

<main role="main" class="col-12 col-md-9 col-xl-8 py-md-3 pl-md-5 bd-content">
    <div id="stations"></div>
</main>

<script src="js/photographer.js"></script>
</body>
</html>
