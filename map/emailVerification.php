<?php require_once "../php/i18n.php"; ?>
<!doctype html>
<html lang="<?php echo $i18n->getAppliedLang(); ?>">
<head>
    <?php
    require_once "../php/header.php";
    $title = L::emailVerification_title;
    ?>
    <title><?php echo $title; ?> - RailwayStations</title>
</head>
<body>

<?php
require_once "../php/navbar.php";
navbar();
?>

<main role="main" class="col-12 col-md-9 col-xl-8 py-md-3 pl-md-5 bd-content">

    <div class="alert alert-success" role="alert">
        <h4 class="alert-heading"><?php echo $title; ?></b></h4>
        <p id="emailVerificationResult"></p>
    </div>

</main>


<script src="js/emailVerification.js"></script>
</body>
</html>
