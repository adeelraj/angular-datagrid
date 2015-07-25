(function () {
  'use strict';

  var angular = this.angular;
  var app = angular.module('octod.test', [
    'octod.datagrid'
  ]);

  app.controller('TestController', function ($filter) {
    this.grid = {};

    this.grid.rows = (function (Row) {
      var rows = [];
      while (rows.length < 41) {
        rows.push(new Row(rows.length));
      }
      return rows;
    })(Row);

    var foo = {bar: false};

    this.grid.schema = [{
      css: 'text-italic',
      key: 'key1',
      name: 'First field',
      style: 'color: #6b8e9e;'
    }, {
      change: function () {
        this.editable = false;
      },
      click: function () {
        // this.editable = true;
        foo.bar = true
      },
      hide: function (){
        // return Math.random() * 10000 > 500;
        // return foo.bar
      },
      key: 'key2',
      name: 'Second field',
      value: function (value) {
        return $filter('date')(value, 'dd-MM-yyyy');
      }
    }];

    this.grid.title = 'Testing out this datagrid.'

    function Row (value) {
      this.key1 = 'Field 1:'+ value;
      this.key2 = new Date;
    }
  });

  app.directive('body', function () {
    return {
      controller: 'TestController',
      controllerAs: 'main'
    }
  });

  app.config(function ($octodDatagridProvider) {
    $octodDatagridProvider.setPartialsFolder('/partials')
  })

}).call(this);

angular.bootstrap(document, ['octod.test']);
