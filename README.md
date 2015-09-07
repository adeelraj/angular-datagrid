Angular datagrid
========================

### Installing angular datagrid

```bash
bower install -s angular-datagrid
```

### Using angular datagrid into your app

First of all, you need to call the script into your html page after after angular.js

```html
  <head>
    <script src="path/to/angular.min.js"></script>
    <script src="bower_components/angular-datagrid/angular-datagrid.js"></script>
  </head>
```

In your main angular.js app file add `ng-datagrid` as a *dependency*

```js
var app = angular.module('myModule', [
  'ng-datagrid'
]);

app.config(function ($angularDatagridProvider) {
  // this function will tell the directive where the html file is located
  // assuming that you've installed angular datagrid using bower you'll have to write
  $angularDatagridProvider.setPartialsFolder('/bower_components/angular-datagrid/');
})
```

In your controller, you'll need to configure your datagrid behaviour

```js
app.controller('MyController', function () {
  this.grid = {};
  // this object can store grid instance configuration
  this.grid.config = {};
  // you can also get them async, docs will come soonish®
  this.grid.rows = [{
    firstColumn: 123,
    secondColumn: 'foo'
  }, {
    firstColumn: 234,
    secondColumn: 'bar'
  }, {
    firstColumn: 345,
    secondColumn: 'baz'
  }];
  // this array will tell the directive how to display datas
  this.grid.schema = [{
    key: 'firstColumn',
    name: 'First column'
  }, {
    key: 'secondColumn',
    name: 'Second column'
  }];
  // you can of course give it a title
  this.grid.title = 'Hello world! I\'s a datagrid';
});
```

Now you can call your datagrid into your html

```html
<div ng-controller="MyController as my">
  <ng-datagrid config="my.grid.config" rows="my.grid.rows" schema="my.grid.schema" datagrid-title="my.grid.title"></ng-datagrid>
</div>
```

### Formatting your content in angular-datagrid

You can rewrite or format each cell value using the `value` function on each schema entry.

```js
app.controller('MyController', ['$filter', function ($filter) {
  var exampleArray = ['First value', 'Second value', 'Last value'];
  // the grid object
  this.grid = {};
  // this object can store grid instance configuration
  this.grid.config = {};
  // you can also get them async, docs will come soonish®
  this.grid.rows = [{
    firstColumn: 123,
    secondColumn: '2015-04-22',
    thirdColumn: 0
  }, {
    firstColumn: 234,
    secondColumn: '2014-07-04',
    thirdColumn: 1
  }, {
    firstColumn: 345,
    secondColumn: '2018-12-01',
    thirdColumn: 2
  }];
  // this array will tell the directive how to display datas
  this.grid.schema = [{
    key: 'firstColumn',
    name: 'First column',
    value: function (value) {
      return $filter('currency')(value, '€');
    }
  }, {
    key: 'secondColumn',
    name: 'Second column',
    value: function (value) {
      return $filter('date')(value, 'dd/MM/yyyy');
    }
  }, {
    key: 'thirdColumn',
    name: 'Third column',
    value: function (value) {
      return exampleArray[value] || '';
    }
  }];
  // you can of course give it a title
  this.grid.title = 'Hello world! I\'s a datagrid';
}]);
```
