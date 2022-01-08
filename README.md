# Railway-Stations.org Webseite

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=RailwayStations_RSWebsite&metric=alert_status)](https://sonarcloud.io/dashboard?id=RailwayStations_RSWebsite)

[railway-stations.org](https://railway-stations.org/) (a.k.a Deutschlands Bahnhöfe) ist ein Community-Projekt, um Bilder zu allen Bahnhöfen zu sammeln. Entstanden ist es am 11.12.2015 auf dem DB-Hackathon in Berlin, zunächst nur mit deutschen Bahnhöfen.

GitHub Organisation:

- [GitHub](https://github.com/RailwayStations)

Weitere Domains:

- [map.railway-stations.org](https://map.railway-stations.org/) (wie die Hauptseite)
- [deutschlands-bahnhoefe.de](http://www.deutschlands-bahnhoefe.de/)
- [schweizer-bahnhoefe.ch](https://schweizer-bahnhoefe.ch/)
- [deutschlands-bahnhöfe.de](http://www.xn--deutschlands-bahnhfe-lbc.de/)

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

Der Code sollte formatiert gepusht werden:

```bash
npm run format
```

## Docker

Die Webseite kann auch mit Docker (multistage build) gebaut und ausgeführt werden.

```bash
docker build . -t railwaystations/rs-website:latest
```

Zum ausführen und testen gegen die produktive RSAPI:

```bash
docker run -it -p 8000:80 railwaystations/rs-website
```

Fullstack Test mit RSAPI und DB mit docker-compose:

```bash
docker-compose up -d
```

Die Webseite ist dann lokal über http://localhost:8000 erreichbar.

## Deployment

Der `main` Branch wird bei jedem Commit automatisch durch GitHub Actions gebaut und auf den Server deployed.

## Übersetzung

Übersetzung der Webseite findet über Crowdin statt: https://crowdin.com/project/railwaystationsorg

---

## Lizenz

Die Webseite ist unter MIT lizensiert. Die Bilder sind größtenteils unter CC-0, einige auch unter CC-BY lizensiert.

[![Docker stats](https://dockeri.co/image/railwaystations/rs-website)](https://hub.docker.com/repository/docker/railwaystations/rs-website)
