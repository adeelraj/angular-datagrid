
  .service('AngularLimiter', function () {
    /**
     * AngularLimiter constructor
     * @param {Array}   pagers    the set of pagers
     * @param {Object}  config    paginator config object
     */
    function AngularLimiter (pagers, config) {
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
      var currentPage = this.config.$currentPage || this.config.currentPage;
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
    AngularLimiter.prototype.getRange = function () {
      return getRange.call(this);
    }

    /**
     * returns if the given page number is in range or not
     * @param  {Number} pageNumber the page number
     * @return {Boolean}
     */
    AngularLimiter.prototype.inRange = function (pageNumber) {
      return inRange.call(this, pageNumber);
    }

    /**
     * sets page number
     * @param {Number} pageNumber
     */
    AngularLimiter.prototype.setCurrentPage = function (pageNumber) {
      this.config.currentPage = pageNumber;
    }

    // returning constructor
    return AngularLimiter;
  })
