/// <reference path="./typings/tsd.d.ts"/>

var path = require('path');

module.exports = {
  entry: {
    'angular-datagrid': path.join(__dirname, 'src/angular-datagrid.ts')
  },
  loader: 'ts-loader',
  output: {
    filename: 'dist/[name].js'
  }
}
