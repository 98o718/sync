#!/bin/bash
set -xe

cd client
yarn
CI=false REACT_APP_STUN=$STUN REACT_APP_TURN=$TURN REACT_APP_TURN_PWD=$TURN_PWD REACT_APP_TURN_USERNAME=$TURN_USERNAME yarn build
rsync -rq --delete --rsync-path="mkdir -p sync-client && rsync" \
$TRAVIS_BUILD_DIR/client/build/ travis@51.15.124.103:sync-client
npm install -g pm2
cd ../server
pm2 deploy ecosystem.config.js production --force

