
  .service('AngularDatagrid', ['$angularDatagrid', 'AngularRow', 'AngularCell', 'AngularPagination', 'AngularLimiter', '$filter', '$http', function ($angularDatagrid, AngularRow, AngularCell, AngularPagination, AngularLimiter, $filter, $http) {
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
     * AngularDatagrid constructor
     * @param {Array} rows   the rows set
     * @param {Object} schema datagrids' schema
     * @param {Object} config datagrids' config
     */
    function AngularDatagrid (rows, schema, config) {
      this.rows = [];
      this.rowsCache = rows;
      this.schema = schema;
      this.config = angular.extend(__config, config);
      this.config.translations = $angularDatagrid.getLocale(config.locale);
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
     * @type {AngularCell}
     */
    AngularDatagrid.Cell = AngularCell;

    /**
     * Limiter constructor
     * @static
     * @type {AngularLimiter}
     */
    AngularDatagrid.Limiter = AngularLimiter;

    /**
     * Pagination constructor
     * @static
     * @type {AngularPagination}
     */
    AngularDatagrid.Pagination = AngularPagination;

    /**
     * Row constructor
     * @static
     * @type {AngularRow}
     */
    AngularDatagrid.Row = AngularRow;


    AngularDatagrid.prototype.asyncInit = function (config) {
      var pageNumber = config.pageNumber || this.config.pagination.currentPage;
      var pagers = config.pagers || this.config.pagination.pagers;
      var rows = config.rows || [];
      var rowsTotal = config.rowsTotal;
      this.getPage(pageNumber);
      this.setRows(rows);
      this.setPageCount(rowsTotal);
      this.setPagers(pagers);
      this.setCurrentPage(pageNumber);
      this.init();
    }

    /**
     * wrapper for AngularPagination.prototype.getFirstPage
     * @return {Undefined}
     */
    AngularDatagrid.prototype.getFirstPage = function () {
      this.pagination.getFirstPage();
      (this.config.onPageSelect || angular.noop).call(this, 1);
    }

    /**
     * wrapper for AngularPagination.prototype.getLastPage
     * @return {Undefined}
     */
    AngularDatagrid.prototype.getLastPage = function () {
      this.pagination.getLastPage();
      (this.config.onPageSelect || angular.noop).call(this, this.pagination.getPageCount());
    }

    /**
     * wrapping and managing AngularPagination.prototype.getPage
     * returns a set of paginated rows
     * @param  {number} pageNumber the pageNumber you are requiring
     * @return {Array}
     */
    AngularDatagrid.prototype.getPage = function (pageNumber) {
      var page = pageNumber || this.pagination.config.currentPage || 1;
      this.rows = this.pagination.getPage(page);
      this.paginator.setCurrentPage(page);
      return this.rows;
    }

    /**
     * returns AngularPagination.config.pagers
     * @return {Array:number}
     */
    AngularDatagrid.prototype.getPagers = function () {
      return this.pagination.getPagers();
    }

    /**
     * wrapping AngularPagination.prototype.getPagers
     * @return {Array}
     */
    AngularDatagrid.prototype.getPaginators = function () {
      var pages = this.pagination.getPages();
      this.paginator.getRange();
      return pages;
    }

    /**
     * returns rowsCache
     * @return {Array}
     */
    AngularDatagrid.prototype.getRowsAll = function () {
      return this.rowsCache;
    }

    /**
     * returns translated string
     * @param  {string} key the translation key
     * @return {string}
     */
    AngularDatagrid.prototype.getTranslated = function (key) {
      return this.config.translations[key] || '';
    }

    /**
     * inits AngularDatagrid
     * @return {AngularDatagrid}
     */
    AngularDatagrid.prototype.init = function () {
      this.redraw();
      this.pagination = new AngularPagination(this.rows, this.config.pagination);
      this.pagination.getFirstPage();
      this.paginator = new AngularLimiter(this.pagination.getPages(), this.config.paginator);
      return this;
    };

    /**
     * returns if the passed page number is in range
     * @param  {Number} pageNumber the page number
     * @return {Boolean}
     */
    AngularDatagrid.prototype.inRange = function (pageNumber) {
      return this.paginator.inRange(pageNumber);
    }

    /**
     * wraps AngularPagination.prototype.isCurrentPage method
     * @param  {Number}  pageNumber
     * @return {Boolean}
     */
    AngularDatagrid.prototype.isCurrentPage = function (pageNumber) {
      return this.pagination.isCurrentPage(pageNumber);
    }

    /**
     * wraps AngularPagination.prototype.isCurrentLimit method
     * @param  {Number}  limit
     * @return {Boolean}
     */
    AngularDatagrid.prototype.isCurrentPager = function (limit) {
      return this.pagination.isCurrentLimit(limit);
    }

    /**
     * returns if the datagrid has pagination controls
     * @return {Boolean}
     */
    AngularDatagrid.prototype.isPaginable = function () {
      return this.config.pagination.visible;
    }

    /**
     * returns if the datagrid is visible
     * @return {Boolean}
     */
    AngularDatagrid.prototype.isVisible = function () {
      return this.config.visible;
    }

    /**
     * outputs current page number
     * @return {Number}
     */
    AngularDatagrid.prototype.pageDisplay = function () {
      return this.pagination.config.$currentPage || this.config.pagination.currentPage;
    }

    /**
     * outputs total pages number
     * @return {Number}
     */
    AngularDatagrid.prototype.pageDisplayTotal = function () {
      return this.pagination.getPageCount();
    }

    /**
     * redraws datagrid rows
     * @return {Undefined}
     */
    AngularDatagrid.prototype.redraw = function () {
      this.rows = [];
      this.rowsCache.forEach(function (rowObject) {
        var rowInstance = new AngularRow(rowObject, this.schema);
        rowInstance.buildCells();
        this.rows.push(rowInstance);
      }, this);
    };


    AngularDatagrid.prototype.setCurrentPage = function (pageNumber) {
      if (pageNumber && typeof pageNumber === 'number') {
        this.paginator.config.$currentPage = pageNumber;
        this.pagination.config.$currentPage = pageNumber;
      }
    }

    /**
     * sets a new limit for pagination.
     * @param {Number} limit
     */
    AngularDatagrid.prototype.setLimit = function (limit) {
      if (this.pagination.setLimit(limit)) this.init();
    }

    /**
     * sets current page
     * @param {Number} pageNumber
     */
    AngularDatagrid.prototype.setPage = function (pageNumber) {
      this.getPage(pageNumber);
      (this.config.onPageSelect || angular.noop).call(this, pageNumber, this.config.pagination.limit);
    }

    /**
     * hardly set pagers
     * @param {Array|Number} pagers the array of numbers or the number
     */
    AngularDatagrid.prototype.setPagers = function (pagers) {
      pagers = Array.isArray(pagers) ? pagers : [pagers];
      this.config.pagination.pagers = pagers;
    }

    /**
     * hardly set page count
     * @param {Number} count page count
     */
    AngularDatagrid.prototype.setPageCount = function (count) {
      if (count && typeof count === 'number') this.config.pagination.rowsLength = count;
    }

    /**
     * sets rows
     * @param {Array} rows
     * @return {AngularDatagrid}
     */
    AngularDatagrid.prototype.setRows = function (rows) {
      this.rowsCache = rows;
      this.init();
      return this;
    };

    /**
     * resets schema object
     * @param {object} schemaObject   datagrid's schema
     */
    AngularDatagrid.prototype.setSchema = function (schemaObject) {
      if (Object.prototype.toString.call(schemaObject) !== '[object Object]') return;
      this.schema = schemaObject;
      this.init();
    }

    /**
     * returns if the stats are visible or not
     * @return {Boolean}
     */
    AngularDatagrid.prototype.showStats = function () {
      return this.config.showStats;
    }

    /**
     * sorts rows
     * @param  {CellSchema} schemaItem
     */
    AngularDatagrid.prototype.sort = function (schemaItem) {
      schemaItem.$sortorder = /^\-/.test(schemaItem.$sortorder) ? schemaItem.key.replace('-', '') : '-'+ schemaItem.key;
      this.rowsCache = $filter('orderBy')(this.rowsCache, schemaItem.$sortorder)
      this.init()
    }

    // returns AngularDatagridInit constructor
    function AngularDatagridInit (rows, schema, config, name) {
      var instance = new AngularDatagrid(rows, schema, config);
      instance.init(true);
      if (typeof config.onPageSelect === 'function') config.onPageSelect.call(instance, 1);
      AngularDatagridInit.cache[name || Date.now()] = instance;
      return instance;
    }

    /**
     * cache object
     * @static
     * @type {Object}
     */
    AngularDatagridInit.cache = {};

    /**
     * exports the constructor
     * @type {AngularDatagrid}
     */
    AngularDatagridInit.constructor = AngularDatagrid;

    // returns AngularDatagridInit constructor
    return AngularDatagridInit;
  }])
