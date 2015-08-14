
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
      this.range = [];
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
     * returns if the given page number is in range or not
     * @param  {Number} pageNumber the page number
     * @return {Boolean}
     */
    OctodLimiter.prototype.inRange = function (pageNumber) {
      return inRange.call(this, pageNumber);
    }

    // returning constructor
    return OctodLimiter;
  })
