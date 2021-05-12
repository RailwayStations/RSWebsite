<?php function navbar(
    $suffixNavItems = null,
    $prefixNavItems = null,
    $additionalItems = null,
    $brandkLink = "index.php"
)
{
    ?>

    <nav class="navbar navbar-expand-md navbar-dark fixed-top" style="background-color: #9F0C35;">
        <div class="container-fluid">
            <a class="navbar-brand" href="<?php echo $brandkLink; ?>" active>
                <img src="images/logo_white.svg" width="30" height="30" class="d-inline-block align-top" alt="">
                Railway<strong>Stations</strong>
            </a>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbar"
                    aria-controls="navbar"
                    aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbar">
                <ul class="navbar-nav mr-auto order-sm-1 order-md-0">
                    <?php if ($prefixNavItems !== null) {
                        echo $prefixNavItems;
                    } ?>

                    <li class="nav-item">
                        <a class="nav-link p-2" href="settings.php" rel="noopener"
                           aria-label="<?php echo L::navbar_settings; ?>" title="<?php echo L::navbar_settings; ?>"><em
                                    class="fas fa-sliders-h"></em></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link p-2" href="faq.php" rel="noopener" aria-label="<?php echo L::navbar_faq; ?>"
                           title="<?php echo L::navbar_faq; ?>"><em class="fas fa-question"></em></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link p-2" href="https://github.com/RailwayStations" rel="noopener"
                           aria-label="<?php echo L::navbar_development; ?>"
                           title="<?php echo L::navbar_development; ?>"><em class="fab fa-github"></em></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link p-2" href="impressum.php" rel="noopener"
                           aria-label="<?php echo L::navbar_impressum; ?>"
                           title="<?php echo L::navbar_impressum; ?>"><em
                                    class="fas fa-info"></em></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link p-2" href="datenschutz.php" rel="noopener"
                           aria-label="<?php echo L::navbar_privacyPolicy; ?>"
                           title="<?php echo L::navbar_privacyPolicy; ?>"><em class="fas fa-shield-alt"></em></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link p-2" href="https://twitter.com/search?q=%23bahnhofsfoto" rel="noopener"
                           aria-label="<?php echo L::navbar_twitter; ?>"
                           title="<?php echo L::navbar_twitter; ?>"><em class="fab fa-twitter"></em></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link p-2" href="https://botsin.space/@railwaystations" rel="noopener"
                           aria-label="<?php echo L::navbar_mastodon; ?>"
                           title="<?php echo L::navbar_mastodon; ?>"><em class="fab fa-mastodon"></em></a>
                    </li>
                    <?php if ($suffixNavItems !== null) {
                        echo $suffixNavItems;
                    } ?>
                </ul>
                <?php if ($additionalItems !== null) {
                    echo $additionalItems;
                } ?>
            </div>
        </div>
    </nav>

    <?php
} ?>
