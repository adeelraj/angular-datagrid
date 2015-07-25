(function () {
  'use strict';

  var angular = this.angular;

  angular.module('octod.datagrid', [])


  .directive('octodDatagrid', ['octodDatagrid', function (octodDatagrid) {
    return {
      controller: ['$scope', function ($scope) {
        this.datagrid = $scope.$new();
      }],
      controllerAs: 'datagrid',
      link: function ($scope, $element, $attrs) {
        var config = $scope.$eval($attrs.config) || {};
        var folder = $scope.$eval($attrs.folder) || '';
        var rows = $scope.$eval($attrs.rows) || [];
        var schema = $scope.$eval($attrs.schema) || [];
        $scope.datagrid = new OctodDatagrid(rows, schema, config);
        $scope.datagrid.partialsFolder = folder;
        $scope.datagrid.title = $attrs.datagridTitle;
      },
      restrict: 'E',
      replace: true,
      templateUrl: function ($scope) {
        return $scope.datagrid.partialsFolder +'partials/octod-datagrid.html';
      }
    }
  }])


  .service('OctodCell', function () {
    /**
     * noop function. It does nothing lol
     * @private
     * @return {Undefined}
     */
    function noop () {};

    /**
     * OctodCell constructor
     * @param {Object} config configuration object
     * @param {Object} row    is the parent row (happens only when instanced by OctodRow constructor)
     */
    function OctodCell (config, row) {
      this.css = config.css;
      this.click = config.click || noop;
      this.editable = config.editable;
      this.hide = config.hide || noop;
      this.key = config.key;
      this.name = config.name;
      this.type = config.type;
      this.value = null;
    }

    /**
     * click event
     * @return {Undefined}
     */
    OctodCell.prototype.click = function () {
      this.click.call(this);
    }

    /**
     * returns css or calls the css function
     * @return {String}
     */
    OctodCell.prototype.getCss = function () {
      return typeof this.css === 'function' ? this.css.call(this) : this.value;
    }

    /**
     * returns value or calls the value function
     * @return {Any}
     */
    OctodCell.prototype.getValue = function () {
      return typeof this.value === 'function' ? this.value() : this.value;
    }

    /**
     * returns true if the cell content is hidden
     * @return {Boolean}
     */
    OctodCell.prototype.ishidden = function () {
      return this.hide();
    }

    // returning OctodCell constructor
    return OctodCell;
  })


  .service('OctodRow', ['OctodCell', function (OctodCell) {
    /**
     * Row constructor
     * @param {Object} row    the row Object
     * @param {Object} schema datagrids' schema Object
     */
    function OctodRow (row, schema) {
      this.cells = [];
      this.row = row;
      this.rowCache = row;
      this.schema = schema;
    }

    /**
     * builds cells array
     * @return {Undefined}
     */
    OctodRow.prototype.buildCells = function () {
      this.schema.forEach(function (schemaObject) {
        var cellInstance = new OctodCell(schemaObject, this.row);
        cellInstance.value = typeof schemaObject.value === 'function' ? schemaObject.value(this.row[schemaObject.key]) : this.row[schemaObject.key];
        this.cells.push(cellInstance);
      }, this);
    }

    /**
     * empties cells set
     * @return {Undefined}
     */
    OctodRow.prototype.empty = function () {
      this.cells = [];
    }

    /**
     * restores the row to the original status
     * @return {Undefined}
     */
    OctodRow.prototype.restore = function () {
      this.row = this.rowCache;
      this.buildCells();
    }

    /**
     * updates original object with the current values
     * @return {Undefined}
     */
    OctodRow.prototype.update = function () {
      this.cells.forEach(function (cellObject) {
        this.row[cellObject.key] = cellObject.value;
      }, this);
    }

    // returns OctodRow
    return OctodRow;
  }])


  .service('OctodPagination', function () {
    function OctodPagination (rows, config) {
      if (!Object.prototype.toString.call(rows) === '[object Array]')
        throw new TypeError('OctodPagination requires a rows:[object Array], provided'+ Object.prototype.toString.call(rows));
      this.config = config || {};
      this.config.limit = config.limit || 10;
      this.config.pagers = config.pagers || [10, 20, 30];
      this.rows = rows || [];
      this.rowsLength = rows.length;
    }

    OctodPagination.prototype.getFirstPage = function () {
      this.getPage(1);
    }

    /**
     * returns the current rows set
     * @param  {number} pageNumber the page number, of course
     * @return {[type]}            [description]
     */
    OctodPagination.prototype.getPage = function (pageNumber) {
      var pages = [];
      if (this.getPages() === 0) return pages;
      while (pages.length < this.config.limit) {
        pages.push(this.rows[this.config.currentPage + pages.length]);
      }
      return;
    }

    /**
     * returns the number of pages available
     * @return {number} the number of pages
     */
    OctodPagination.prototype.getPages = function () {
      if (!this.config.pageCount) this.config.pageCount = Math.ceil(this.rowsLength / this.config.limit);
      return this.config.pageCount;
    };

    /**
     * sets a page
     * @param {number} pageNumber the page number
     */
    OctodPagination.prototype.setPage = function (pageNumber) {
      if (this.getPages() > 0) this.config.currentPage = pageNumber;
    }

    // retuns OctodPagination
    return OctodPagination;
  })


  .service('OctodDatagrid', ['OctodRow', 'OctodCell', 'OctodPagination', function (OctodRow, OctodCell, OctodPagination) {
    /**
     * Config defaults
     * @private
     * @type {Object}
     */
    var __config = {
      pagination: {
        limit: 10,
        pagers: [10, 20, 30],
        visible: true
      },
      visible: true
    };

    /**
     * OctodDatagrid constructor
     * @param {Array} rows   the rows set
     * @param {Object} schema datagrids' schema
     * @param {Object} config datagrids' config
     */
    function OctodDatagrid (rows, schema, config) {
      this.rows = [];
      this.rowsCache = rows;
      this.schema = schema;
      this.config = angular.extend(__config, config);
    };

    /**
     * Cell constructor
     * @static
     * @type {OctodCell}
     */
    OctodDatagrid.Cell = OctodCell;

    /**
     * Pagination constructor
     * @static
     * @type {OctodPagination}
     */
    OctodDatagrid.Pagination = OctodPagination;

    /**
     * Row constructor
     * @static
     * @type {OctodRow}
     */
    OctodDatagrid.Row = OctodRow;

    /**
     * inits OctodDatagrid
     * @return {OctodDatagrid}
     */
    OctodDatagrid.prototype.init = function () {
      this.redraw();
      this.pagination = new OctodPagination(this.rows, this.config.pagination);
      this.pagination.getPages();
      this.pagination.getFirstPage();
      return this;
    };

    /**
     * returns if the datagrid has pagination controls
     * @return {Boolean}
     */
    OctodDatagrid.prototype.isPaginable = function () {
      return this.config.pagination.visible;
    }

    /**
     * returns if the datagrid is visible
     * @return {Boolean}
     */
    OctodDatagrid.prototype.isVisible = function () {
      return this.config.visible;
    }

    /**
     * redraws datagrid rows
     * @return {Undefined}
     */
    OctodDatagrid.prototype.redraw = function () {
      this.rowsCache.forEach(function (rowObject) {
        var rowInstance = new OctodRow(rowObject, this.schema);
        rowInstance.buildCells();
        this.rows.push(rowInstance);
      }, this);
    };

    /**
     * sets rows
     * @param {Array} rows
     * @return {OctodDatagrid}
     */
    OctodDatagrid.prototype.setRows = function (rows) {
      this.rows = rows;
      this.redraw();
      return this;
    };

    /**
     * resets schema object
     * @param {object} schemaObject   datagrid's schema
     */
    OctodDatagrid.prototype.setSchema = function (schemaObject) {
      if (Object.prototype.toString.call(schemaObject) !== '[object Object]') return;
      this.schema = schemaObject;
      this.redraw();
    }

    // returns OctodDatagridInit constructor
    function OctodDatagridInit (rows, schema, config, name) {
      var instance = new OctodDatagrid(rows, schema, config);
      instance.init();
      OctodDatagridInit.cache[name || Date.now()] = instance;
      return instance;
    }

    /**
     * cache object
     * @static
     * @type {Object}
     */
    OctodDatagridInit.cache = {};

    // returns OctodDatagridInit constructor
    return OctodDatagridInit;
  }])

}).call(this);
