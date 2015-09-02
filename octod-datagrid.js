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
        $scope.datagrid.title = $attrs.datagridTitle ? $scope.$eval($attrs.datagridTitle) : false;
        if ($attrs.rows) {
          $scope.$watch($attrs.rows, function () {
            $scope.datagrid = new OctodDatagrid($scope.$eval($attrs.rows) || [], schema, config);
          });
        } else {
          $scope.datagrid = new OctodDatagrid(rows, schema, config);
        }
      },
      restrict: 'E',
      replace: true,
      templateUrl: function () {
        return $octodDatagrid.partialsPath +'/octod-datagrid.html'+ $octodDatagrid.getDebugQuerystring();
      },
      transclude: true
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
    /**
     * configuration Object
     * @static
     * @type {Object}
     */
    var config = {
      debug: false,
      locale: {
        __default: {
          browsingPage: 'Browsing page',
          browsingPageOf: 'of',
          loadingError: 'Error while loading datas. Please refresh your browser.',
          loadingProgress: 'Loading, please wait.',
          pageFirst: 'First page',
          pageLast: 'Last page',
          rowsPerPage: 'Rows per page',
          totalPages: 'total pages.'
        },
        'it-it': {
          browsingPage: 'Guardando la pagina',
          browsingPageOf: 'di',
          loadingError: 'Errore durante il caricamento dei dati. Prego ricaricare la pagina.',
          loadingProgress: 'Sto caricando, aspetta ancora un pochino.',
          pageFirst: 'Prima pagina',
          pageLast: 'Seconda pagina',
          rowsPerPage: 'Righe per pagina',
          totalPages: 'pagine totali.'
        }
      },
      partials: {
        path: ''
      }
    };

    /**
     * $get main function while using the provider in an angular injected function
     * @return {Object}
     */
    this.$get = function () {
      return {
        addLocal: function (name, config) {
          var exists = config.locale[name];
          if (!exists) return config.locale[name] = angular.extend(config.locale.__default, config);
          config.locale[name] = angular.extend(exists, config);
        },
        /**
         * returns debug querystring. A simple hack to avoid caching
         * @static
         * @return {String}
         */
        getDebugQuerystring: function () {
          return config.debug ? '?datetime='+ Date.now() : '';
        },
        /**
         * returns localized object if present
         * @static
         * @return {Object}
         */
        getLocale: function (localeName) {
          return config.locale[localeName] ? config.locale[localeName] : config.locale.__default;
        },
        /**
         * the partials path. Useful to set where the directive should pick the view
         * @static
         * @type {String}
         */
        partialsPath: config.partials.path
      };
    }

    /**
     * sets debugmode on/off
     * @static
     * @param  {Boolean} debugmode
     * @return {Undefined}
     */
    this.debug = function (debugmode) {
      config.debug = debugmode;
    }

    /**
     * adds a localization object
     * @static
     * @param  {String} localeName the i18n locale name
     * @param  {Object:string} config     a set of keys: translations
     * @return {Undefined}
     */
    this.localeAdd = function (localeName, config) {
      config.locale[localeName] = config;
    }

    /**
     * sets the partialsPath parameter used by $get.partialsPath
     * @static
     * @param {String} folder
     */
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
      this.clickCallback = config.click || noop;
      this.css = config.css;
      this.childCss = config.childCss;
      this.options = config.options || '';
      this.editable = config.editable;
      this.hide = config.hide || noop;
      this.key = config.key;
      this.model = null;
      this.name = config.name;
      this.style = config.style;
      this.type = config.type;
      this.value = null;
      // accessible when clicking
      this.$row = row;
    }

    /**
     * calls change event on the cell instanced
     * @return {Undefined}
     */
    OctodCell.prototype.change = function () {
      this.changeCallback.call(this, this.$row);
      this.updateValue();
    }

    /**
     * click event
     * @return {Undefined}
     */
    OctodCell.prototype.click = function () {
      this.clickCallback.call(this, this.$row);
    }

    /**
     * returns css or calls the css function
     * @return {String}
     */
    OctodCell.prototype.getCss = function () {
      return typeof this.css === 'function' ? this.css.call(this, this.$row) : this.css;
    }

    /**
     * returns child element css or calls the css function
     * @return {String}
     */
    OctodCell.prototype.getChildCss = function () {
      return typeof this.childCss === 'function' ? this.childCss.call(this, this.$row) : this.childCss;
    }

    /**
     * returns cell instance style
     * @return {Any}
     */
    OctodCell.prototype.getStyle = function () {
      return this.style;
    }

    /**
     * sets model and valueCache
     * returns value or calls the value function
     * @return {Any}
     */
    OctodCell.prototype.getValue = function () {
      this.model = this.valueCache = typeof this.value === 'function' ? this.value.call(this, this.$row) : this.value;
      return this.model;
    }

    /**
     * returns true if the cell content is hidden
     * @return {Boolean}
     */
    OctodCell.prototype.ishidden = function () {
      return this.hide.call(this, this.$row);
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
    /**
     * returns the type
     * @param  {Any} object the variable you wish to check
     * @return {String}        stringed type
     * @example typeOf(/[0-9]/) === [object RegExp]
     */
    function typeOf (object) {
      return Object.prototype.toString.call(object);
    }

    /**
     * OctodPagination constructor
     * @param {Array} rows   the rows set
     * @param {Object} config pagination config
     */
    function OctodPagination (rows, config) {
      if (!typeOf(rows) === '[object Array]')
        throw new TypeError('OctodPagination requires a rows:[object Array], provided'+ typeOf(rows));

      this.config = config || {};
      this.config.limit = config.limit || 10;
      this.config.pagers = config.pagers || [10, 20, 30];
      this.rows = rows || [];
      this.rowsLength = config.pageCount || rows.length;
    }

    /**
     * returns first page.
     * @return {Array}
     */
    OctodPagination.prototype.getFirstPage = function () {
      return this.getPage(1);
    }

    /**
     * returns last page.
     * @return {Array}
     */
    OctodPagination.prototype.getLastPage = function () {
      return this.getPage(this.getPageCount());
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
      for (var i = 0; i < this.config.limit; i++) {
        var index = ((this.config.currentPage - 1) * this.config.limit) + pages.length;
        if (this.rows[index]) pages.push(this.rows[index]);
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
     * returns if the passed pageNumber is the current one
     * @param  {Number}  pageNumber
     * @return {Boolean}
     */
    OctodPagination.prototype.isCurrentPage = function (pageNumber) {
      return this.config.currentPage === pageNumber;
    }

    /**
     * returns if the passed limit is the current one
     * @param  {Number}  limit
     * @return {Boolean}
     */
    OctodPagination.prototype.isCurrentLimit = function (limit) {
      return this.config.limit === limit;
    }

    /**
     * sets a new pagination limit only if the limit is in pagers array
     * @param {Number} limit
     * @return {Boolean} true if the new limit is set
     */
    OctodPagination.prototype.setLimit = function (limit) {
      if (!limit in this.config.pagers) return false;
      this.config.currentPage = 1;
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


  .service('OctodLimiter', function () {
    /**
     * OctodLimiter constructor
     * @param {Array}   pagers    the set of pagers
     * @param {Object}  config    paginator config object
     */
    function OctodLimiter (pagers, config) {
      this.config = config || {};
      this.pagers = pagers || [];
      this.pagersVisible = [];
    };

    /**
     * returns if the passed page is inside the acceptable range of pagers
     * @private
     * @param  {Number} pageNumber page number
     * @return {Boolean}
     */
    function inRange (pageNumber) {
      return this.pagersVisible.filter(function (pager) { return pager === pageNumber; }).length > 0;
    };

    /**
     * returns available range
     * @private
     * @return {Array}
     */
    function getRange () {
      var limit = Math.floor(this.config.limit / 2);
      var isEven = this.config.limit % 2 === 0;
      var currentPage = this.config.currentPage;
      var firstpage = currentPage - limit;
      var lastpage = currentPage + limit;
      if (isEven) lastpage = lastpage - 1;
      if (firstpage <= 1) {
        firstpage = 1;
        lastpage = this.config.limit;
      }
      if (lastpage >= pagerLast.call(this)) {
        lastpage = pagerLast.call(this);
        firstpage = lastpage - (limit * 2);
        if (isEven) firstpage = firstpage + 1;
      }
      this.pagersVisible = [];
      return this.pagersVisible = this.pagers.filter(function (pager) {
        return pager >= firstpage && pager <= lastpage;
      }, this);
    };

    /**
     * returns first pager
     * @private
     * @return {Number}
     */
    function pagerFirst () {
      return this.pagers[0];
    }

    /**
     * returns last pager
     * @private
     * @return {Number}
     */
    function pagerLast () {
      return this.pagers[this.pagers.length - 1];
    }

    /**
     * gets the visible range of paginators
     * @return {Array}
     */
    OctodLimiter.prototype.getRange = function () {
      return getRange.call(this);
    }

    /**
     * returns if the given page number is in range or not
     * @param  {Number} pageNumber the page number
     * @return {Boolean}
     */
    OctodLimiter.prototype.inRange = function (pageNumber) {
      return inRange.call(this, pageNumber);
    }

    /**
     * sets page number
     * @param {Number} pageNumber
     */
    OctodLimiter.prototype.setLimit = function (pageNumber) {
      this.config.currentPage = pageNumber;
    }

    // returning constructor
    return OctodLimiter;
  })


  .service('OctodDatagrid', ['$octodDatagrid', 'OctodRow', 'OctodCell', 'OctodPagination', 'OctodLimiter', '$http', function ($octodDatagrid, OctodRow, OctodCell, OctodPagination, OctodLimiter, $http) {
    /**
     * Config defaults
     * @private
     * @type {Object}
     */
    var __config = {
      locale: '__default',
      onPageSelect: null,
      pagination: {
        currentPage: 1,
        limit: 10,
        pagers: [10, 20, 30],
        visible: true
      },
      paginator: {
        currentPage: 1,
        limit: 5,
        visible: true
      },
      showStats: true,
      translations: {},
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
      this.config.translations = $octodDatagrid.getLocale(config.locale);
    };

    function queryobject(pageNumber) {
      var object = {};
      object[this.config.api.page || 'page'] = pageNumber;
      object[this.config.api.limit || 'limit'] = this.config.pagination.limit;
      return object;
    }

    /**
     * Cell constructor
     * @static
     * @type {OctodCell}
     */
    OctodDatagrid.Cell = OctodCell;

    /**
     * Limiter constructor
     * @static
     * @type {OctodLimiter}
     */
    OctodDatagrid.Limiter = OctodLimiter;

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
     * wrapper for OctodPagination.prototype.getFirstPage
     * @return {Undefined}
     */
    OctodDatagrid.prototype.getFirstPage = function () {
      this.pagination.getFirstPage();
      (this.config.onPageSelect || angular.noop).call(this, 1);
    }

    /**
     * wrapper for OctodPagination.prototype.getLastPage
     * @return {Undefined}
     */
    OctodDatagrid.prototype.getLastPage = function () {
      this.pagination.getLastPage();
      (this.config.onPageSelect || angular.noop).call(this, this.pagination.getPageCount());
    }

    /**
     * wrapping and managing OctodPagination.prototype.getPage
     * returns a set of paginated rows
     * @param  {number} pageNumber the pageNumber you are requiring
     * @return {Array}
     */
    OctodDatagrid.prototype.getPage = function (pageNumber) {
      var page = pageNumber || this.pagination.config.currentPage || 1;
      this.rows = this.pagination.getPage(page);
      this.paginator.setLimit(page);
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
    OctodDatagrid.prototype.getPaginators = function () {
      var pages = this.pagination.getPages();
      this.paginator.getRange();
      return pages;
    }

    /**
     * returns rowsCache
     * @return {Array}
     */
    OctodDatagrid.prototype.getRowsAll = function () {
      return this.rowsCache;
    }

    /**
     * returns translated string
     * @param  {string} key the translation key
     * @return {string}
     */
    OctodDatagrid.prototype.getTranslated = function (key) {
      return this.config.translations[key] || '';
    }

    /**
     * inits OctodDatagrid
     * @return {OctodDatagrid}
     */
    OctodDatagrid.prototype.init = function () {
      this.redraw();
      this.pagination = new OctodPagination(this.rows, this.config.pagination);
      this.pagination.getFirstPage();
      this.paginator = new OctodLimiter(this.pagination.getPages(), this.config.paginator);
      return this;
    };

    /**
     * returns if the passed page number is in range
     * @param  {Number} pageNumber the page number
     * @return {Boolean}
     */
    OctodDatagrid.prototype.inRange = function (pageNumber) {
      return this.paginator.inRange(pageNumber);
    }

    /**
     * wraps OctodPagination.prototype.isCurrentPage method
     * @param  {Number}  pageNumber
     * @return {Boolean}
     */
    OctodDatagrid.prototype.isCurrentPage = function (pageNumber) {
      return this.pagination.isCurrentPage(pageNumber);
    }

    /**
     * wraps OctodPagination.prototype.isCurrentLimit method
     * @param  {Number}  limit
     * @return {Boolean}
     */
    OctodDatagrid.prototype.isCurrentPager = function (limit) {
      return this.pagination.isCurrentLimit(limit);
    }

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
     * outputs current page number
     * @return {Number}
     */
    OctodDatagrid.prototype.pageDisplay = function () {
      return this.config.pagination.currentPage;
    }

    /**
     * outputs total pages number
     * @return {Number}
     */
    OctodDatagrid.prototype.pageDisplayTotal = function () {
      return this.pagination.getPageCount();
    }

    /**
     * redraws datagrid rows
     * @return {Undefined}
     */
    OctodDatagrid.prototype.redraw = function () {
      this.rows = [];
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
     * sets current page
     * @param {Number} pageNumber
     */
    OctodDatagrid.prototype.setPage = function (pageNumber) {
      this.getPage(pageNumber);
      (this.config.onPageSelect || angular.noop).call(this, pageNumber, this.config.pagination.limit);
    }

    /**
     * hardly set pagers
     * @param {Array|Number} pagers the array of numbers or the number
     */
    OctodDatagrid.prototype.setPagers = function (pagers) {
      pagers = Array.isArray(pagers) ? pagers : [pagers];
      this.config.pagination.pagers = pagers;
    }

    /**
     * hardly set page count
     * @param {Number} count page count
     */
    OctodDatagrid.prototype.setPageCount = function (count) {
      if (count && typeof count === 'number') this.config.pageCount = count;
    }

    /**
     * sets rows
     * @param {Array} rows
     * @return {OctodDatagrid}
     */
    OctodDatagrid.prototype.setRows = function (rows) {
      this.rowsCache = rows;
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

    /**
     * returns if the stats are visible or not
     * @return {Boolean}
     */
    OctodDatagrid.prototype.showStats = function () {
      return this.config.showStats;
    }

    // returns OctodDatagridInit constructor
    function OctodDatagridInit (rows, schema, config, name) {
      var instance = new OctodDatagrid(rows, schema, config);
      instance.init(true);
      if (typeof config.onPageSelect === 'function') config.onPageSelect.call(instance, 1);
      OctodDatagridInit.cache[name || Date.now()] = instance;
      return instance;
    }

    /**
     * cache object
     * @static
     * @type {Object}
     */
    OctodDatagridInit.cache = {};

    /**
     * exports the constructor
     * @type {OctodDatagrid}
     */
    OctodDatagridInit.constructor = OctodDatagrid;

    // returns OctodDatagridInit constructor
    return OctodDatagridInit;
  }])

  ;
}).call(this);
