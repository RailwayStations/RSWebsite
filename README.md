# Railway-Stations.org

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/3d92741c7b374125bd22f8e58af898cb)](https://app.codacy.com/app/peter-storch/RSWebsite?utm_source=github.com&utm_medium=referral&utm_content=RailwayStations/RSWebsite&utm_campaign=badger)

Railway-Stations.org (a.k.a Deutschlands Bahnhöfe) ist ein Community-Projekt, um Bilder zu allen Bahnhöfen zu sammeln. Entstanden ist es am 11.12.2015 auf dem DB-Hackathon in Berlin, zunächst nur mit deutschen Bahnhöfen.

Sie finden die Seite unter [railway-stations.org](https://railway-stations.org/)

Aktueller Stand
---------------

Das Projekt hat sich rasant entwickelt. Innerhalb des ersten Jahres wurden über 1500 Fotos eingereicht und an weiteren Hackathons wurden Stück für Stück neue Funktionen und weitere Länder hinzugefügt.
Eine [Android](https://play.google.com/store/apps/details?id=de.bahnhoefe.deutschlands.bahnhofsfotos) und eine iOS App (derzeit in der Testphase, bei Interesse bitte per [eMail](mailto:bahnhofsfotos@deutschlands-bahnhoefe.de) melden) sind entstanden.

Inventur
--------

Diese Seiten gehören zu Railway-Stations.org:

Hauptseite
- [railway-stations.org](https://railway-stations.org/) + [github](https://github.com/RailwayStations/RSWebsite)

Weitere Domains:
- [map.railway-stations.org](https://map.railway-stations.org/) (wie die Hauptseite)
- [deutschlands-bahnhoefe.de](http://www.deutschlands-bahnhoefe.de/)
- [schweizer-bahnhoefe.ch](https://schweizer-bahnhoefe.ch/)
- [deutschlands-bahnhöfe.de](http://www.xn--deutschlands-bahnhfe-lbc.de/)

Mobile Apps:
- [Android App](https://play.google.com/store/apps/details?id=de.bahnhoefe.deutschlands.bahnhofsfotos) + [github](https://github.com/RailwayStations/RSAndroidApp)
- iOS App [github](https://github.com/RailwayStations/Bahnhofsfotos)

REST API
- [https://api.railway-stations.org](https://api.railway-stations.org)
- [github](https://github.com/RailwayStations/RSAPI)

Umgebung
--------

Die Seite benötigt eine PHP Umgebung (ab 5.6). Zum lokalen Testen kann eine passende Umgbung mit Apache und PHP über Docker gestartet werden:

```

docker run -d -p 8088:80 --name rs-website -v "$PWD":/var/www/html php:7.2-apache

```

Danach steht die Seite unter http://localhost:8088/map zur Verfügung.

Deployment
--------

Mit dem Bash Script `./deploy.sh` kann die Seite auf dem Server aktualisiert werden.

---

Lizenz
------

Die Webseite ist unter MIT lizensiert. Die Bilder sind größtenteils unter CC-0, einige auch unter CC-BY lizensiert.
