(function () {
  'use strict';

  var angular = this.angular;

  angular.module('octod.datagrid', [])


  .directive('octodDatagrid', ['OctodDatagrid', '$octodDatagrid', function (OctodDatagrid, $octodDatagrid) {
    return {
      controller: ['$scope', function ($scope) {
        this.datagrid = $scope.$new();
      }],
      controllerAs: 'datagrid',
      link: function ($scope, $element, $attrs) {
        var config = $attrs.config ? $scope.$eval($attrs.config) : {};
        var rows = $attrs.rows ? $scope.$eval($attrs.rows) : [];
        var schema = $attrs.schema ? $scope.$eval($attrs.schema) : [];
        $scope.datagrid = new OctodDatagrid(rows, schema, config);
        $scope.datagrid.title = $attrs.datagridTitle ? $scope.$eval($attrs.datagridTitle) : false;
      },
      restrict: 'E',
      replace: true,
      templateUrl: function () {
        return $octodDatagrid.partialsPath +'/octod-datagrid.html'+ $octodDatagrid.getDebugQuerystring();
      }
    }
  }])


  .directive('odEnter', function () {
    return {
      link: function ($scope, $element, $attrs) {
        if (!$attrs.odEnter) return;
        angular.element($element).on('keyup', function (event) {
          var keycode = event.keyCode === 13;
          if (!keycode) return;
          if ($attrs.odEnterKill) event.preventDefault();

          return $scope.$eval($attrs.odEnter);
        });
      },
      restrict: 'A'
    }
  })


  .directive('odEsc', function () {
    return {
      link: function ($scope, $element, $attrs) {
        if (!$attrs.odEsc) return;

        angular.element($element).on('keydown', function (event) {
          if (event.keyCode === 27) $scope.$eval($attrs);
        });
      },
      restrict: 'A'
    }
  })


  .directive('odStyle', function () {
    return {
      link: function ($scope, $element, $attrs) {
        if (!$attrs.odStyle) return;
        try {
          angular.element($element).attr('style', $scope.$eval($attrs.odStyle));
        } catch (error) {
          angular.element($element).attr('style', $attrs.odStyle);
        }
      },
      restrict: 'A'
    }
  })


  .provider('$octodDatagrid', function () {
    var config = {
      debug: false,
      partials: {
        path: ''
      }
    };

    this.$get = function () {
      return {
        getDebugQuerystring: function () {
          return config.debug ? '?datetime='+ Date.now() : '';
        },
        partialsPath: config.partials.path
      };
    }

    this.debug = function (debugmode) {
      config.debug = debugmode;
    }

    this.setPartialsFolder = function (folder) {
      if (typeof folder === 'string') config.partials.path = folder;
    }
  })


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
      this.changeCallback = config.change || noop;
      this.css = config.css;
      this.clickCallback = config.click || noop;
      this.editable = config.editable;
      this.hide = config.hide || noop;
      this.key = config.key;
      this.model = null;
      this.name = config.name;
      this.style = config.style;
      this.type = config.type;
      this.value = null;
    }

    /**
     * calls change event on the cell instanced
     * @return {Undefined}
     */
    OctodCell.prototype.change = function () {
      this.changeCallback.call(this);
      this.updateValue();
    }

    /**
     * click event
     * @return {Undefined}
     */
    OctodCell.prototype.click = function () {
      this.clickCallback.call(this);
    }

    /**
     * returns css or calls the css function
     * @return {String}
     */
    OctodCell.prototype.getCss = function () {
      return typeof this.css === 'function' ? this.css.call(this) : this.css;
    }

    /**
     * sets model and valueCache
     * returns value or calls the value function
     * @return {Any}
     */
    OctodCell.prototype.getValue = function () {
      this.model = this.valueCache = typeof this.value === 'function' ? this.value() : this.value;
      return this.model;
    }

    /**
     * returns true if the cell content is hidden
     * @return {Boolean}
     */
    OctodCell.prototype.ishidden = function () {
      return this.hide();
    }

    /**
     * restore values to previous value
     * @return {Undefined}
     */
    OctodCell.prototype.restoreValue = function () {
      this.value = this.model = this.valueCache;
    }

    /**
     * exits from edit mode and resets model to previous value
     * @return {Undefined}
     */
    OctodCell.prototype.undo = function () {
      console.log(123)
      this.editable = false;
      this.model = this.value;
    }

    /**
     * updates the value
     * @return {Undefined}
     */
    OctodCell.prototype.updateValue = function () {
      this.value = this.model;
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
    function typeOf (object) {
      return Object.prototype.toString.call(object);
    }

    function OctodPagination (rows, config) {

      if (!typeOf(rows) === '[object Array]')
        throw new TypeError('OctodPagination requires a rows:[object Array], provided'+ typeOf(rows));

      this.config = config || {};
      this.config.limit = config.limit || 10;
      this.config.pagers = config.pagers || [10, 20, 30];
      this.rows = rows || [];
      this.rowsLength = rows.length;
    }

    /**
     * returns first page.
     * @return {Undefined}
     */
    OctodPagination.prototype.getFirstPage = function () {
      this.getPage(1);
    }

    /**
     * returns last page.
     * @return {Undefined}
     */
    OctodPagination.prototype.getLastPage = function () {
      this.getPage(this.getPageCount());
    }

    /**
     * returns the current rows set
     * @param  {number} pageNumber the page number, of course
     * @return {[type]}            [description]
     */
    OctodPagination.prototype.getPage = function (pageNumber) {
      var pages = [];
      if (!this.hasPages()) return pages;
      if (pageNumber) this.config.currentPage = pageNumber;
      while (pages.length < this.config.limit) {
        pages.push(this.rows[this.config.currentPage + pages.length]);
      }
      return pages;
    }

    /**
     * returns the number of pages available
     * @return {number} the number of pages
     */
    OctodPagination.prototype.getPageCount = function () {
      return this.config.pageCount = Math.ceil(this.rowsLength / this.config.limit);
    };

    /**
     * returns config.pagers
     * @return {Array:number}
     */
    OctodPagination.prototype.getPagers = function () {
      return this.config.pagers;
    }

    /**
     * returns an array with page numbers
     * @return {Array:number}
     */
    OctodPagination.prototype.getPages = function () {
      if (!this.hasPages()) return;
      var pages = [];
      var page = 1;
      while (pages.length < this.getPageCount()) {
        pages.push(page);
        page++;
      }
      return pages;
    }

    /**
     * returs if the pagination system could have more than 0 pages
     * @return {Boolean}
     */
    OctodPagination.prototype.hasPages = function () {
      return this.getPageCount() > 0;
    }

    /**
     * sets a new pagination limit only if the limit is in pagers array
     * @param {Number} limit
     * @return {Boolean} true if the new limit is set
     */
    OctodPagination.prototype.setLimit = function (limit) {
      if (!limit in this.config.pagers) return false;
      this.config.limit = limit;
      return true;
    }

    /**
     * sets a page
     * @param {number} pageNumber the page number
     */
    OctodPagination.prototype.setPage = function (pageNumber) {
      if (this.hasPages()) this.config.currentPage = pageNumber;
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
        currentPage: 1,
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
     * wrapping and managing OctodPagination.prototype.getPage
     * returns a set of paginated rows
     * @param  {number} pageNumber the pageNumber you are requiring
     * @return {Array}
     */
    OctodDatagrid.prototype.getPage = function (pageNumber) {
      this.rows = this.pagination.getPage(pageNumber || this.pagination.config.currentPage || 1);
      return this.rows;
    }

    /**
     * returns OctodPagination.config.pagers
     * @return {Array:number}
     */
    OctodDatagrid.prototype.getPagers = function () {
      return this.pagination.getPagers();
    }

    /**
     * wrapping OctodPagination.prototype.getPagers
     * @return {Array}
     */
    OctodDatagrid.prototype.getPages = function () {
      return this.pagination.getPages();
    }

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
     * sets a new limit for pagination.
     * @param {Number} limit
     */
    OctodDatagrid.prototype.setLimit = function (limit) {
      if (this.pagination.setLimit(limit)) this.init();
    }

    /**
     * sets rows
     * @param {Array} rows
     * @return {OctodDatagrid}
     */
    OctodDatagrid.prototype.setRows = function (rows) {
      this.rows = rows;
      this.init();
      return this;
    };

    /**
     * resets schema object
     * @param {object} schemaObject   datagrid's schema
     */
    OctodDatagrid.prototype.setSchema = function (schemaObject) {
      if (Object.prototype.toString.call(schemaObject) !== '[object Object]') return;
      this.schema = schemaObject;
      this.init();
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

  ;
}).call(this);