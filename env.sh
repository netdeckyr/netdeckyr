#!/bin/bash
if [ -z "$1" ]; then
    FILE="secret.sh"
else
    FILE="$1"
fi

export NODE_PATH=$NODE_PATH:$(pwd):$(pwd)/src
export SQLITE3_DB_PATH=$(pwd)/dev.sqlite3
export SQLITE3_DB_FILENAME=dev.sqlite3
export DB_NAME=netdeckyr
export DB_USERNAME=netdeckyr
export CONFIGURATION_ENV=development
export NETDECKYR_PORT=4545

if [ -f "$FILE" ]; then
    source "$FILE"
fi
