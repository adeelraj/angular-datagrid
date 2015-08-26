
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
      this.rowsLength = rows.length;
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
