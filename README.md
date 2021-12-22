# Railway-Stations.org

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=RailwayStations_RSWebsite&metric=alert_status)](https://sonarcloud.io/dashboard?id=RailwayStations_RSWebsite)

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

Man kann für lokale Testzwecke die API_URL umkonfigurieren (geht aktuell nicht, siehe https://github.com/RailwayStations/RSWebsite/issues/105):
```bash
npm config set railway-stations-frontend:api_url http://192.168.0.241:8080/
```

Während der Entwicklung kann man mit webpack-watch die Änderungen sofort im Browser sehen:
```bash
NODE_ENV=development npm run-script webpack-watch
```

Der Code sollte formatiert gepusht werden:
```bash
npm run format
```

Danach geht es weiter mit der [Umgebung](#umgebung) um die Website in einem Browser anzeigen zu können.

## Docker

Die Webseite kann auch mit Docker (multistage build) gebaut und ausgeführt werden.

```bash
docker build . -t railwaystations/rs-website:latest
```

Zum lokalen ausführen und testen dann mit:

```bash
docker run -it -p 80:80 -e API_URL=http://192.168.0.229:8080/ railwaystations/rs-website
```

Wobei hier mit `-it` der interaktive Modus verwendet wird. Mit `-d` wird die Website im Hintergrund ausgeführt. Mit setzen der Umgebungsvariable `API_URL` kann man auf eine lokale Testinstanz der RSAPI zugreifen. Ansonsten wird `api.railway-stations.org` als Default gesetzt.

## Umgebung

Die Seite benötigt eine PHP Umgebung (ab 5.6). Zum lokalen Testen kann eine passende Umgbung mit Apache und PHP über Docker gestartet werden:

```sh
chmod go+w i18n/langcache
docker run -d -p 8088:80 --name rs-website -v "$PWD":/var/www/rs-website railwaystations/rs-website:latest
```

Danach steht die Seite unter http://localhost:8088 zur Verfügung.

## Deployment

Der `main` Branch wird bei jedem Commit automatisch durch Github Actions gebaut und auf den Server deployed.

### Translation

Help to translate the project via Crowdin: https://crowdin.com/project/railwaystationsorg

---

## Lizenz

Die Webseite ist unter MIT lizensiert. Die Bilder sind größtenteils unter CC-0, einige auch unter CC-BY lizensiert.


[![Docker stats](https://dockeri.co/image/railwaystations/rs-website)](https://hub.docker.com/repository/docker/railwaystations/rs-website)
