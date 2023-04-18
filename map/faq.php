<?php require_once "../php/i18n.php"; ?>
<!doctype html>
<html lang="<?php echo $i18n->getAppliedLang(); ?>">
<head>
    <title>FAQ - RailwayStations</title>
    <?php require_once "../php/header.php"; ?>
</head>
<body>

<?php
require_once "../php/navbar.php";
navbar();
?>

<main role="main" class="col-12 col-md-9 col-xl-8 py-md-3 pl-md-5 bd-content container">

    <ul class="list-inline text-right">
        <li hreflang="de" class="de list-inline-item"><a href="#" onclick="$('#en-faq').hide();$('#de-faq').show();"
                                                         hreflang="de">DE</a></li>
        <li hreflang="en" class="en list-inline-item"><a href="#" onclick="$('#de-faq').hide();$('#en-faq').show();"
                                                         hreflang="en">EN</a></li>
    </ul>

    <div class="info" id="de-faq">
        <p>Wir möchten uns bei allen Foto-Lieferanten ganz herzlich bedanken. Damit hatten wir nicht gerechnet, dass
            sich so viele beteiligen.</p>
        <p>In dem Zusammenhang haben wir uns folgende Regeln überlegt:</p>
        <h4>Kann mein Foto von einem anderen Fotografen überschrieben werden?</h4>
        <p>Nein, der Erste, der ein Foto einreicht, ist quasi der Owner von diesem Fotoplatz. Es werden grundsätzlich
            keine Fotos ausgetauscht, die von unterschiedlichen Fotografen kommen.</p>
        <h4>Kann ich ein neues Foto einreichen, wenn vielleicht die Wetterlage besser ist und ich ein schöneres Foto
            machen konnte?</h4>
        <p>Ja, das kannst Du, wenn Du als Erster ein Foto für diesen Bahnhof eingereicht hat. Bitte beschränke das auf
            maximal 2 Nachreichungen, da die Kollegen, die Dein Foto einarbeiten, das in ihrer Freizeit tun.</p>
        <h4>Wollt Ihr Hochglanzfotos?</h4>
        <p>Nein. Wir wollen ganz normale Fotos, egal bei welcher Wetterlage.</p>
        <h4>Bearbeitet Ihr unsere Fotos nach?</h4>
        <p>Wir werden sie eventuell auf die benötigte Größe verkleinern und Personen sowie Autokennzeichen verpixeln.</p>
        <h4>Wie kann ich ein Foto einreichen?</h4>
        <p>Du kannst es über unsere Webseite oder unsere mobilen Apps einreichen:<br/>
            <a href="https://f-droid.org/packages/de.bahnhoefe.deutschlands.bahnhofsfotos/"><img src="https://fdroid.gitlab.io/artwork/badge/get-it-on.png"
alt="Get it on F-Droid" height="80"></a><a href="https://play.google.com/store/apps/details?id=de.bahnhoefe.deutschlands.bahnhofsfotos"><img src="https://play.google.com/intl/en_us/badges/images/generic/en-play-badge.png"
alt="Get it on Google Play" height="80"></a>&nbsp;&nbsp;<a href="https://apps.apple.com/us/app/bahnhofsfotos/id1476038821"><img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg"
     alt="Download on the App Store" height="54"></a><br/>
 <strong>Bitte schicke uns keine Fotos per E-Mail!</strong></p>
        <h4>Was muss ich beim Fotografieren beachten?</h4>
        <p>Wenn ein Bahnhofsgebäude vorhanden ist, bitte dieses nur von Aussen fotografieren, da das von der
            Panoramafreiheit abgedeckt ist. Fotos, die im Gebäude gemacht worden sind bzw. vom Gleis oder Bahnsteig
            innerhalb eines Bahnhofsgebäudes müssen wir leider zurückweisen, da wir hier die gesetzlichen Regelungen
            beachten müssen. Erläutert haben wir das <a
                    href="http://www.gaby-becker.de/de/bahnhofsfotos-gesucht-fuer-ein-opendata-projekt.html">hier</a>.
        </p>
        <p>Gut wäre in jedem Fall, wenn Ihr Euch beim Fotografieren nicht auf dem Bahngelände aufhaltet.</p>
        <p>Panoramafrei ist ein Foto dann, wenn es von einem öffentlichen Platz, einer öffentlichen Straße oder einem
            solchen Bürgersteig aus aufgenommen worden ist. Benutzt Ihr eine Leiter, ist die Geschichte mit der
            Panoramafreiheit bereits nicht mehr gegeben. Aus dem Zug heraus bitte nicht fotografieren, weil es a) nicht
            mehr panoramafrei wäre und b) wollen wir mit den Fotos eigentlich eine Orientierung für Ortsunkundige
            liefern. Diese sehen den Bahnsteig aber nicht von Aussen.</p>
        <p>Wenn Euch das Thema Panoramafreiheit noch mehr beschäftigt, findet Ihr <a
                    href="http://m.heise.de/ct/ausgabe/2012-21-Juristische-Klippen-bei-der-Veroeffentlichung-von-Bildern-im-Web-2337754.html">hier </a>und
            <a href="https://www.business-best-practice.de/selbststaendige/nutzungsrechte-an-fotografien.php">hier </a>weitere
            Ausführungen dazu.</p>
        <p>Ein ganz wichtiger Punkt: bringt Euch beim Fotografieren nicht in gefährliche Situationen. Keine Fotos vom
            Bahnübergang von der Straße, wenn die Schranke oben ist oder was auch immer. Bedenkt bitte auch, dass das zu
            Nachahmungen führen kann.</p>
        <p>Wir geben die hier eingestellten Fotos per Schnittstelle weiter an andere Entwickler, damit diese in ihren
            Anwendungen die Bahnhöfe visualisieren können. Es wäre einfach super, wenn diese sich nicht noch um die
            rechtlichen Aspekte kümmern müßten.</p>
        <h4>Welche Größe müssen die Fotos haben?</h4>
        <p>Wir benötigen 1920 x 1080 px und verkleinern uns die von Euch eingesandten Fotos gerne.</p>
        <h4>Nehmt Ihr auch verschwommene Fotos?</h4>
        <p>Nein. Der User soll ja etwas auf den Fotos erkennen können, damit er sich orientieren kann.</p>
        <h4>Wie kann ich als Entwickler an die Fotos bzw. die API kommen?</h4>
        <p>Wir haben all unsere Entwicklungen offen auf <a href="https://github.com/RailwayStations">GitHub</a>
            zugänglich gemacht. Dort solltest Du auch alle Links zu den Schnittstellen finden.</p>
        <h4>Speziell für Frankreich gilt:</h4>
        <p>Wir haben uns nach Änderung der Gesetzgebung zur Panoramafreiheit in Frankreich dazu entschieden,
            auch <strong>französische</strong> Bahnhöfe mit aufzunehmen. Hierbei ist jedoch für Entwickler, die die
            Schnittstelle nutzen wollen, <strong>unbedingt</strong> zu beachten, <strong>dass die Daten nicht
                kommerziell genutzt werden dürfen</strong>. Also selbst ein Werbebanner in einer App stellt eine
            kommerzielle Nutzung dar. Bitte unbedingt darauf achten! Das gilt nur für Frankreich.</p>
    </div>

    <!-- en FAQ -->
    <div class="info" id="en-faq" style="display:none">
        <h4>Why are we doing this photo collecting stuff of railway stations?</h4>
        <p>We would like to create open data, because of the fact, that there are only a few free usable photos of
            Railway Stations. Developer could make definitly nicer applications with photos. So we thought, now is the
            time to give developers the possibility to add nice photos from the crowd for their applications. Our
            communication is mostly on Twitter. We would be happy, if you send you photo into the Timeline.</p>
        <p>We want to say thank you to all photo suppliers. We had not expected so many to participate.</p>
        <h4>Could my photo be substituted by any other photographer?</h4>
        <p>No, the first one submitting a photo is in general the owner of this Photo-Place. There are basically no
            photos exchanged by different photographers.</p>
        <h4>Is it possible to submit a new photo in the case e.g. the weather is better and i could make a nicer
            photo?</h4>
        <p>Yes, you can do this when you are the first to submit a photo for this station. Please limit this to a
            maximum of 2 submissions, as the colleagues, who incorporate your photo, do it in their spare time.</p>
        <h4>Do you want only high quality and photoshoped photos?</h4>
        <p>No. We want normal photos, regardless of the weather.</p>
        <h4>Do you make any changes to my photo?</h4>
        <p>We only reduce it to the required size and pixelate people and license plates.</p>
        <h4>How can I submit a photo?</h4>
        <p>You can submit it via our website or our mobile apps:<br/>
            <a href="https://f-droid.org/packages/de.bahnhoefe.deutschlands.bahnhofsfotos/"><img src="https://fdroid.gitlab.io/artwork/badge/get-it-on.png"
alt="Get it on F-Droid" height="80"></a><a href="https://play.google.com/store/apps/details?id=de.bahnhoefe.deutschlands.bahnhofsfotos"><img src="https://play.google.com/intl/en_us/badges/images/generic/en-play-badge.png"
alt="Get it on Google Play" height="80"></a>&nbsp;&nbsp;<a href="https://apps.apple.com/us/app/bahnhofsfotos/id1476038821"><img src="https://developer.apple.com/app-store/marketing/guidelines/images/badge-download-on-the-app-store.svg"
     alt="Download on the App Store" height="54"></a><br/>
     <strong>Please don't send us photos via e-mail!</strong></p>
        <h4>What do I have to consider while taking the photo?</h4>
        <p>If a station building is available, please only take a photo from the outside, as it is covered by the FOP
            (Freedom of panorama). Photos that have been made in the building or from the track or platform within a
            station building, we must unfortunately reject, since we have to consider to the legal regulations. We
            explained this here:<br/>
            In any case, it would be a good idea if you were not on the environment of the station area when
            photographing.<br/>
            A photo has the status to be a Freedom of panorama photo when it has been taken from a public place, a
            public street. From inside the train please don't take any photos, because they are 1) no longer under
            freedom of panorama and 2) we want to provide the people which are not familiar with the place with these
            station photos. </p>
        <p>A very important point: be careful, when you take photos especially on roads or on crossings. We don't want
            you to be involved into accidents. </p>
        <p>We provide an interface for developers, so that they can pimp their applications with photos.<br/>
            It would be great if they did not have to take care of the legal aspects.</p>
        <h4>What size must the photos have?</h4>
        <p>We need photos with min. 1920 x 1080 px. If your photo is bigger, we minimize the photos for you.</p>
        <h4>Do you also take blurred photos?</h4>
        <p>No. Make sure to clean your lens before ;-).</p>
        <h4>How can I get the photos or API as a developer?</h4>
        <p>We have made all our developments openly available on <a href="https://github.com/RailwayStations">GitHub</a>.
            There you should also find all links to the interfaces.</p>
        <h4>Especially for france:</h4>
        <p>After amending the legislation on freedom of panorama in France, we have decided to include French stations
            as well. However, for developers who want to use the interface, it is important to note that the data must
            not be used commercially. So even an advertising banner in an app is a commercial use. Please pay attention
            to this! This applies only to France.</p>
    </div>

</main>

<script src="js/basic.js"></script>

</body>
</html>
