(function () {
  'use strict';

  var angular = this.angular;
  var app = angular.module('octod.test', [
    'octod.datagrid'
  ]);

  app.controller('TestController', function ($filter, $http) {
    var controller = this;
    var counter = 1;

    function makerows(number) {
      var rows = [];
      while (rows.length < number) {
        rows.push(new Row(rows.length));
      }
      return rows;
    }

    var Row = function (value) {
      this.key1 = 'Row number: '+ (value + 1);
      this.key2 = new Date;
      this.key3 = Math.floor(Math.random() * ((3 - 1) + 1));
      this.key4 = Math.floor(Math.random() * ((4 - 1) + 1));
    }

    this.grid = {};

    this.grid.config = {
      ajax: {
        api: 'test.json',
        page: 'foo',
        limit: 'bar'
      },
      smallCells: true
    }

    this.grid.rows = makerows(600);

    this.array = 'often,sometimes,never'.split(',');

    this.arrayBtns = 'btn info,btn success,btn warning,btn danger'.split(',');

    this.grid.schema = [{
      css: 'col-md-2',
      key: 'key1',
      name: 'First field',
      click: function () {
        controller.grid.rows = makerows(counter);
        counter++;
      }
    }, {
      css: 'col-md-2',
      change: function () {
        this.editable = false;
      },
      click: function () {
        this.editable = true;
      },
      hide: function () {
        // return Math.random() * 10000 > 500;
        // return foo.bar
      },
      key: 'key2',
      name: 'Second field',
      value: function (value) {
        return $filter('date')(value, 'dd-MM-yyyy');
      }
    }, {
      css: 'col-md-2',
      key: 'key3',
      name: 'third field',
      value: function (value) {
        return controller.array[value] || 'none';
      }
    }, {
      css: 'dont-select align-center',
      childCss: function () {
        var css = controller.arrayBtns[this.getValue()];
        return css ? 'btn '+ css : '';
      },
      click: function (row) {
        row.key4 = this.value < controller.arrayBtns.length -1 ? this.value ++ : (this.value = 0);
      },
      key: 'key4',
      name: 'Variable css',
      type: 'button'
    }];

    this.grid.title = 'Testing out this datagrid.';

    // $http.get('test.json').success(function (response) {
    //   this.grid.rows = response.rows;
    // }.bind(this))
  });

  app.directive('body', function () {
    return {
      controller: 'TestController',
      controllerAs: 'main'
    }
  });

  app.config(function ($octodDatagridProvider) {
    $octodDatagridProvider.debug(true);
    $octodDatagridProvider.setPartialsFolder('/partials');
  })

}).call(this);

angular.bootstrap(document, ['octod.test']);
