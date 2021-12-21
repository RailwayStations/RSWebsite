#!/bin/bash
set -e

sed -r "s#__API_URL__#${API_URL}#g" config-template.json > map/json/config.json

apache2-foreground
