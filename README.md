# Railway-Stations.org Webseite

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=RailwayStations_RSWebsite&metric=alert_status)](https://sonarcloud.io/dashboard?id=RailwayStations_RSWebsite) [![Crowdin](https://badges.crowdin.net/railwaystationsorg/localized.svg)](https://crowdin.com/project/railwaystationsorg)

[railway-stations.org](https://railway-stations.org/) (a.k.a Deutschlands Bahnhöfe) ist ein Community-Projekt, um Bilder zu allen Bahnhöfen zu sammeln. Entstanden ist es am 11.12.2015 auf dem DB-Hackathon in Berlin, zunächst nur mit deutschen Bahnhöfen.

GitHub Organisation:

- [GitHub](https://github.com/RailwayStations)

Weitere Domains:

- [map.railway-stations.org](https://map.railway-stations.org/) (wie die Hauptseite)
- [deutschlands-bahnhoefe.de](http://www.deutschlands-bahnhoefe.de/)

Mobile Apps:

- [Android App](https://play.google.com/store/apps/details?id=de.bahnhoefe.deutschlands.bahnhofsfotos), [F-Droid](https://f-droid.org/de/packages/de.bahnhoefe.deutschlands.bahnhofsfotos/) und [GitHub](https://github.com/RailwayStations/RSAndroidApp)
- [iOS App](https://apps.apple.com/de/app/bahnhofsfotos/id1476038821) und [GitHub](https://github.com/RailwayStations/Bahnhofsfotos)

Web-API:

- [https://api.railway-stations.org](https://api.railway-stations.org)
- [GitHub](https://github.com/RailwayStations/RSAPI)

## Bauen

Benötigte tools: [PHP-composer](https://getcomposer.org/) und [npm](https://www.npmjs.com/get-npm)

Wenn beide Tools vorhanden sind, dann können sie ausgeführt werden:

```bash
composer install
npm ci
npm run build
```

Während der Entwicklung kann man mit webpack-watch die Änderungen sofort im Browser sehen:

```bash
NODE_ENV=development npm run-script webpack-watch
```

Zum lokalen Testen kann eine passende Umgbung mit Apache und PHP über Docker gestartet werden:

```sh
chmod go+w i18n/langcache
docker run -d -p 8000:80 --name rs-website -v "$PWD":/var/www/html php:8.2-apache
```

Danach steht die Seite unter http://127.0.0.1:8000/map zur Verfügung.

### Testen mit lokalem RSAPI Backend

Das Backend kann für lokale Tests mit docker-compose gestartet werden:

```sh
docker-compose up -d
```

Damit die Website das lokale Backend anspricht, muss im Hauptverzeichnis eine `.env` Datei mit folgenden Werten angelegt werden:

```
API_URL=http://127.0.0.1:8080/
CLIENT_ID=RailwayStationsWebsiteLocal
REDIRECT_URI=http://127.0.0.1:8000/map/settings.php
```

## Deployment

Der `main` Branch wird bei jedem Commit automatisch durch GitHub Actions gebaut und auf den Server deployed.

### Formatierung

Der Code sollte formatiert gepusht werden:

```bash
npm run format
```

## Übersetzung

Übersetzung der Webseite findet über Crowdin statt: https://crowdin.com/project/railwaystationsorg

---

## Lizenz

Die Webseite ist unter MIT lizensiert. Die Bilder sind größtenteils unter CC-0, einige auch unter CC-BY lizensiert.
