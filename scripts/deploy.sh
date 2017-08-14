#!/usr/bin/env bash

# Executes cleanup function at script exit.
trap cleanup EXIT

cleanup() {
  kill $(ps aux | grep 'SimpleHTTPServer 8000' | awk '{print $2}')
}

python -m SimpleHTTPServer 8000
