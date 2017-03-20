'use strict';

process.env.BABEL_ENV = 'node';
require('babel-register')();

const app = require('./server-code/server').default;

app.listen(process.env.PORT || 3001);

if (process.env.NODE_ENV !== 'production') {
  const livereload = require('livereload');
  livereload.createServer().watch('dist');
}
