<?php

require_once '../../vendor/philipp15b/php-i18n/i18n.class.php';

$i18n = new i18n();
$i18n->setCachePath('../../i18n/langcache');
$i18n->setFilePath('../../i18n/lang/lang_{LANGUAGE}.ini');
$i18n->setFallbackLang("en");
$i18n->init();

$appliedLang = $i18n->getAppliedLang();

$data = parse_ini_file("../../i18n/lang/lang_" . $appliedLang . ".ini", true);
header('Content-Type: application/json');
echo json_encode($data);
