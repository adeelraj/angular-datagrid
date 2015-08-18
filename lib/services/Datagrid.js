
  .service('OctodDatagrid', ['$octodDatagrid', 'OctodRow', 'OctodCell', 'OctodPagination', 'OctodLimiter', function ($octodDatagrid, OctodRow, OctodCell, OctodPagination, OctodLimiter) {
    /**
     * Config defaults
     * @private
     * @type {Object}
     */
    var __config = {
      ajaxPagination: false,
      http: {
        get: ''
      },
      locale: '__default',
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
    }

    /**
     * wrapper for OctodPagination.prototype.getLastPage
     * @return {Undefined}
     */
    OctodDatagrid.prototype.getLastPage = function () {
      this.pagination.getLastPage();
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
    OctodDatagrid.prototype.getPages = function () {
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
