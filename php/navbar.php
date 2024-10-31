<?php function navbar(
    $suffixNavItems = null,
    $prefixNavItems = null,
    $additionalItems = null,
    $brandkLink = "index.php"
) {
    ?>

    <nav class="navbar navbar-expand-md navbar-dark fixed-top" style="background-color: #9F0C35;">
        <div class="container-fluid">
            <a class="navbar-brand" href="<?php echo $brandkLink; ?>" active>
                <img src="images/logo_white.svg" width="30" height="30" class="d-inline-block align-top" alt="">
                Railway<strong>Stations</strong>
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbar"
                    aria-controls="navbar"
                    aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbar">
                <?php if ($additionalItems !== null) {
                    echo $additionalItems;
                } ?>
                <ul class="navbar-nav me-auto order-sm-1 order-md-0">
                    <?php if ($prefixNavItems !== null) {
                        echo $prefixNavItems;
                    } ?>
                    <li class="nav-item">
                        <a class="nav-link p-2" href="settings.php" rel="noopener"
                           aria-label="<?php echo L::navbar_settings; ?>" title="<?php echo L::navbar_settings; ?>"><i
                                    class="fas fa-sliders-h"></i></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link p-2" href="faq.php" rel="noopener" aria-label="<?php echo L::navbar_faq; ?>"
                           title="<?php echo L::navbar_faq; ?>"><i class="fas fa-question"></i></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link p-2" href="https://github.com/RailwayStations" rel="noopener"
                           aria-label="<?php echo L::navbar_development; ?>"
                           title="<?php echo L::navbar_development; ?>"><i class="fab fa-github"></i></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link p-2" href="impressum.php" rel="noopener"
                           aria-label="<?php echo L::navbar_impressum; ?>"
                           title="<?php echo L::navbar_impressum; ?>"><i
                                    class="fas fa-info"></i></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link p-2" href="datenschutz.php" rel="noopener"
                           aria-label="<?php echo L::navbar_privacyPolicy; ?>"
                           title="<?php echo L::navbar_privacyPolicy; ?>"><i class="fas fa-shield-alt"></i></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link p-2" href="https://zug.network/@railwaystations" rel="me" rel="noopener"
                           aria-label="<?php echo L::navbar_mastodon; ?>"
                           title="<?php echo L::navbar_mastodon; ?>"><i class="fab fa-mastodon"></i></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link p-2" href="inbox.php" rel="noopener" id="nav_inbox"
                            aria-label="<?php echo L::navbar_inbox; ?>"
                            title="<?php echo L::navbar_inbox; ?>"><i class="fas fa-inbox"></i></a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link p-2" href="outbox.php" rel="noopener" id="nav_outbox"
                            aria-label="<?php echo L::navbar_outbox; ?>"
                            title="<?php echo L::navbar_outbox; ?>"><i class="fa-solid fa-arrow-up-from-bracket"></i></a>
                    </li>                    
                    <?php if ($suffixNavItems !== null) {
                        echo $suffixNavItems;
                    } ?>
                    <li>
                        <script src="https://liberapay.com/Railway-Stations.org/widgets/button.js"></script>
                        <noscript><a href="https://liberapay.com/Railway-Stations.org/donate"><img alt="Donate using Liberapay" src="https://liberapay.com/assets/widgets/donate.svg"></a></noscript>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <?php
} ?>
