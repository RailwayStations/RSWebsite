<?php require_once "../php/i18n.php"; ?>
<!doctype html>
<html lang="<?php echo $i18n->getAppliedLang(); ?>">
<head>
    <?php require_once "../php/header.php"; ?>
    <title><?php echo L::inbox_title; ?></title>
</head>
<body>

<?php
require_once "../php/navbar.php";
navbar();
?>

<main role="main" class="py-md-3 pl-md-5 bd-content">
    <div id="uploads" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
    </div>
</main>

<script src="js/inbox.js"></script>
</body>
</html>
