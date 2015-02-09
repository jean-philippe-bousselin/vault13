#!/bin/sh

cd ../src
echo 'Running npm install... Please input root passwd:'
su -c "npm install"
echo 'Running bower install...'
bower install
echo 'Done.'