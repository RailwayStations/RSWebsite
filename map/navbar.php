<?php function navbar($suffixNavItems = null, $prefixNavItems = null, $additionalItems = null, $brandkLink = "index.php") { ?>
    


<nav class="navbar navbar-expand-md navbar-dark fixed-top" style="background-color: #9F0C35;">
    <a class="navbar-brand" href="<?php echo $brandkLink ?>" active>
        <img src="images/logo_white.svg" width="30" height="30" class="d-inline-block align-top" alt="">
        Railway<strong>Stations</strong>
    </a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar" aria-controls="navbar" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>

    <div class="collapse navbar-collapse" id="navbar">
        <?php if ($additionalItems !== null) {
            echo $additionalItems;
        } ?>
        <ul class="navbar-nav mr-auto order-sm-1 order-md-0">
            <?php if ($prefixNavItems !== null) {
                echo $prefixNavItems;
            } ?>

            <li class="nav-item">
                <a class="nav-link p-2" href="settings.php" rel="noopener" aria-label="Einstellungen" title="Einstellungen"><i class="fas fa-sliders-h"></i></a>
            </li>
            <li class="nav-item">
                <a class="nav-link p-2" href="faq.php" rel="noopener" aria-label="FAQ" title="FAQ"><i class="fas fa-question"></i></a>
            </li>
            <li class="nav-item">
                <a class="nav-link p-2" href="https://github.com/RailwayStations" rel="noopener" aria-label="Entwicklung" title="Entwicklung"><i class="fab fa-github"></i></a>
            </li>
            <li class="nav-item">
                <a class="nav-link p-2" href="impressum.php" rel="noopener" aria-label="Impressum" title="Impressum"><i class="fas fa-info"></i></a>
            </li>
            <li class="nav-item">
                <a class="nav-link p-2" href="datenschutz.php" rel="noopener" aria-label="Datenschutzerklärung" title="Datenschutzerklärung"><i class="fas fa-shield-alt"></i></a>
            </li>
            <?php if ($suffixNavItems !== null) {
                echo $suffixNavItems;
            } ?>
        </ul>
    </div>
</nav>

<?php } ?>