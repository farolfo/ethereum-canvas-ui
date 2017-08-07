#!/usr/bin/env bash

# Executes cleanup function at script exit.
trap cleanup EXIT

cleanup() {
  rm bundle.js
}

browserify src/app.js -o bundle.js && python -m SimpleHTTPServer 8000

