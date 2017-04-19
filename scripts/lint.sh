#!/bin/bash

./node_modules/.bin/eslint index.js server-code/**/*.{js,jsx}

if [[ $? != 0 ]];
  then ./scripts/notify.sh Eslint "Eslint error"
fi
