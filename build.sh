#!/usr/bin/env bash

npm run build

mkdir -p build

cat dist/css/chunk-vendors.*.css dist/css/app.*.css > build/picture-annotation.css

cp dist/js/app.*.js build/picture-annotation.min.js
cp dist/js/app.*.js.map build/picture-annotation.min.js.map
cp dist/js/chunk-vendors.*.js build/picture-annotation-vendors.min.js
cp dist/js/chunk-vendors.*.js.map build/picture-annotation-vendors.min.js.map

