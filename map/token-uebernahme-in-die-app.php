<?php require_once "../php/i18n.php"; ?>
<!doctype html>
<html lang="<?php echo $i18n->getAppliedLang(); ?>">
<head>
    <?php
    require_once "../php/header.php";
    $title = L::passwordUpdate_title;
    $info = L::passwordUpdate_info;
    $mobileInfo = L::passwordUpdate_mobileInfo;
    $happy = L::passwordUpdate_happy;
    ?>
    <title><?php echo $title; ?> - RailwayStations</title>
</head>
<body>

<?php
require_once "../php/navbar.php";
navbar();
?>

<main role="main" class="col-12 col-md-9 col-xl-8 py-md-3 pl-md-5 bd-content container">

    <div class="alert alert-success" role="alert">
        <h4 class="alert-heading"><?php echo $info; ?></b></h4>
        <p><?php echo $mobileInfo; ?></p>
        <hr>
        <p class="mb-0"><?php echo $happy; ?></p>
    </div>

</main>


<script src="js/updatePassword.js"></script>
</body>
</html>
