# Railway-Stations.org

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/078d5d9052634ddcb67b92f3998918c6)](https://www.codacy.com/gh/RailwayStations/RSWebsite?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=RailwayStations/RSWebsite&amp;utm_campaign=Badge_Grade) [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=RailwayStations_RSWebsite&metric=alert_status)](https://sonarcloud.io/dashboard?id=RailwayStations_RSWebsite)

Railway-Stations.org (a.k.a Deutschlands Bahnhöfe) ist ein Community-Projekt, um Bilder zu allen Bahnhöfen zu sammeln. Entstanden ist es am 11.12.2015 auf dem DB-Hackathon in Berlin, zunächst nur mit deutschen Bahnhöfen.

Sie finden die Seite unter [railway-stations.org](https://railway-stations.org/)

## Aktueller Stand

Das Projekt hat sich rasant entwickelt. Innerhalb des ersten Jahres wurden über 1500 Fotos eingereicht und an weiteren Hackathons wurden Stück für Stück neue Funktionen und weitere Länder hinzugefügt.
Eine [Android](https://play.google.com/store/apps/details?id=de.bahnhoefe.deutschlands.bahnhofsfotos) und eine iOS App (derzeit in der Testphase, bei Interesse bitte per [eMail](mailto:bahnhofsfotos@deutschlands-bahnhoefe.de) melden) sind entstanden.

## Inventur

Diese Seiten gehören zu Railway-Stations.org:

Hauptseite
- [railway-stations.org](https://railway-stations.org/) + [github](https://github.com/RailwayStations/RSWebsite)

Weitere Domains:
- [map.railway-stations.org](https://map.railway-stations.org/) (wie die Hauptseite)
- [deutschlands-bahnhoefe.de](http://www.deutschlands-bahnhoefe.de/)
- [schweizer-bahnhoefe.ch](https://schweizer-bahnhoefe.ch/)
- [deutschlands-bahnhöfe.de](http://www.xn--deutschlands-bahnhfe-lbc.de/)

Mobile Apps:
- [Android App](https://play.google.com/store/apps/details?id=de.bahnhoefe.deutschlands.bahnhofsfotos), [F-Droid](https://f-droid.org/de/packages/de.bahnhoefe.deutschlands.bahnhofsfotos/) und [github](https://github.com/RailwayStations/RSAndroidApp)
- [iOS App](https://apps.apple.com/de/app/bahnhofsfotos/id1476038821) und [github](https://github.com/RailwayStations/Bahnhofsfotos)

REST API
- [https://api.railway-stations.org](https://api.railway-stations.org)
- [github](https://github.com/RailwayStations/RSAPI)

## Bauen

Benötigte tools: [PHP-composer](https://getcomposer.org/) und [npm](https://www.npmjs.com/get-npm)

Wenn beide Tools vorhanden sind, dann können sie ausgeführt werden:
```bash
composer install
npm ci
npm run build
```

Der Code sollte formatiert gepusht werden:
```bash
npm run format
```

Danach geht es weiter mit der [Umgebung](#umgebung) um die Website in einem Browser anzeigen zu können.

## Umgebung

Die Seite benötigt eine PHP Umgebung (ab 5.6). Zum lokalen Testen kann eine passende Umgbung mit Apache und PHP über Docker gestartet werden:

```sh
chmod go+w i18n/langcache
docker run -d -p 8088:80 --name rs-website -v "$PWD":/var/www/rs-website railwaystations/rs-website:latest
```

Danach steht die Seite unter http://localhost:8088 zur Verfügung.

## Deployment

Der `master` Branch wird bei jedem Commit automatisch durch Github Actions gebaut und auf den Server deployed.

---

## Lizenz

Die Webseite ist unter MIT lizensiert. Die Bilder sind größtenteils unter CC-0, einige auch unter CC-BY lizensiert.


[![Docker stats](https://dockeri.co/image/railwaystations/rs-website)](https://hub.docker.com/repository/docker/railwaystations/rs-website)