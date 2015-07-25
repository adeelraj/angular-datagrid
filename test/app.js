(function () {
  'use strict';

  var angular = this.angular;
  var app = angular.module('octod.test', [
    'octod.datagrid'
  ]);

  app.controller('TestController', function ($filter) {
    var controller = this;

    var Row = function (value) {
      this.key1 = 'Field 1:'+ value;
      this.key2 = new Date;
      this.key3 = Math.floor(Math.random() * ((3 - 1) + 1));
    }

    this.grid = {};

    this.grid.rows = (function (Row) {
      var rows = [];
      while (rows.length < 41) {
        rows.push(new Row(rows.length));
      }
      return rows;
    })(Row);

    this.array = [
      'often',
      'sometimes',
      'never'
    ];

    this.grid.schema = [{
      css: 'col-md-2',
      key: 'key1',
      name: 'First field',
      style: 'color: #6b8e9e;'
    }, {
      css: 'col-md-2',
      change: function () {
        this.editable = false;
      },
      click: function () {
        this.editable = true;
      },
      hide: function (){
        // return Math.random() * 10000 > 500;
        // return foo.bar
      },
      key: 'key2',
      name: 'Second field',
      value: function (value) {
        // return $filter('date')(value, 'dd-MM-yyyy');
        return !!value
      },
      type: 'checkbox'
    }, {
      css: 'col-md-2',
      key: 'key3',
      name: 'third field',
      value: function (value) {
        return controller.array[value] || 'none';
      }
    }];

    this.grid.title = 'Testing out this datagrid.';
  });

  app.directive('body', function () {
    return {
      controller: 'TestController',
      controllerAs: 'main'
    }
  });

  app.config(function ($octodDatagridProvider) {
    $octodDatagridProvider.debug(true);
    $octodDatagridProvider.setPartialsFolder('/partials')
  })

}).call(this);

angular.bootstrap(document, ['octod.test']);
