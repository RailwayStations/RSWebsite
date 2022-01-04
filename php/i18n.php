<?php
require_once "../vendor/philipp15b/php-i18n/i18n.class.php";

session_start();

if (isset($_GET["lang"])) {
    $_SESSION["lang"] = $_GET["lang"];
}

$i18n = new i18n();
$i18n->setCachePath("../i18n/langcache");
$i18n->setFilePath("../i18n/lang/lang_{LANGUAGE}.ini");
$i18n->setFallbackLang("en");
$i18n->setMergeFallback(true);
$i18n->init();
