
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
      if (!this.hasPages()) return pages;
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
     * returns an array with page numbers
     * @return {Array:number}
     */
    OctodPagination.prototype.getPagers = function () {
      if (!this.hasPages()) return;
      var pages = [];
      var page = 1;
      while (pages.length < this.getPages()) {
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
      return this.getPages() > 0;
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
