
  .service('OctodDatagrid', ['OctodRow', 'OctodCell', 'OctodPagination', 'OctodLimiter', function (OctodRow, OctodCell, OctodPagination, OctodLimiter) {
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
      paginator: {
        currentPage: 1,
        limit: 5,
        pagers: [5],
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
      this.pagination.getFirstPage();
      this.limiter = new OctodPagination(this.pagination.getPages(), this.config.paginator);
      this.limiter.getPages();
      this.limiter.getFirstPage();
      return this;
    };

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
