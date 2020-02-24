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
    <h2 id="title-form"><?php echo L::inbox_title; ?></h2>
    <div id="inboxEntries" class="row row-cols-1 row-cols-md-2 row-cols-lg-3 row-cols-xl-4">
    </div>

    <h2 id="title-form"><?php echo L::inbox_recentImports; ?></h2>
    <label>
        <select class="custom-select" id="sinceHours" onChange="javascript:changeSinceHours();">
            <option value="1"><?php echo L::inbox_oneHour; ?></option>
            <option value="10" selected><?php echo L::inbox_tenHours; ?></option>
            <option value="24"><?php echo L::inbox_oneDay; ?></option>
            <option value="168"><?php echo L::inbox_oneWeek; ?></option>
            <option value="672"><?php echo L::inbox_oneMonth; ?></option>
        </select>
    </label>
    <div id="recentImports">
    </div>
</main>

<script src="js/inbox.js"></script>
</body>
</html>
