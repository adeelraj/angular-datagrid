
  .service('OctodLimiter', function () {
    /**
     * OctodLimiter constructor
     * @param {Number} current      the current index
     * @param {Number} count        the number of elements available for pagination
     * @param {Number} limit        the number of visible elements to display
     */
    function OctodLimiter (current, count, limit) {
      this.count = count;
      this.current = current;
      this.limit = limit;
      this.beforeAfter = Math.floor(this.limit / (limit % 2 == 0 ? 2 : 3));
    };

    /**
     * adds items after
     * used when items before have a negative index
     * @private
     * @param {Array} itemsSet the set of items
     * @param {Number} expectedLength    the expectedLength
     */
    function addItemsAfter (itemsSet, expectedLength) {
      var array = [].concat(itemsSet);
      for (var i = itemsSet.length; i <= expectedLength; i++) array.push(i);
      return array;
    }

    /**
     * adds items after
     * used when items after are greater than the counted items
     * @private
     * @param {Array} itemsSet the set of items
     * @param {Number} expectedLength    the expectedLength
     */
    function addItemsBefore (itemsSet, expectedLength) {
      var array = [].concat(itemsSet);
      for (var i = itemsSet.length; i <= expectedLength; i--)
        if (i > 0) array.push(i);
      return array;
    }

    /**
     * filters negative items
     * @private
     * @param  {Array} itemsSet
     * @return {Array}
     */
    function filterNegatives (itemsSet) {
      return itemsSet.filter(function (item) {
        return item >= 0;
      });
    }

    /**
     * gets items before the current index
     * @return {Array}
     */
    OctodLimiter.prototype.getItemsAfter = function () {
      var items = [];
      for (var i = this.current; i < this.current + this.beforeAfter; i++) items.push(i);
      return items;
    }

    /**
     * gets items after the current index
     * @return {Array}
     */
    OctodLimiter.prototype.getItemsBefore = function () {
      var items = [];
      for (var i = this.current; i > this.current - this.beforeAfter; i--) items.push(i);
      return items;
    }

    /**
     * returns the range of items selectable
     * @return {Array} the range
     */
    OctodLimiter.prototype.getRange = function () {
      var range = [];
      return range;
    }

    /**
     * returns if the provided number is in the current yelded range
     * @param  {Number} number the number
     * @return {Boolean}
     */
    OctodLimiter.prototype.inRange = function (number) {
      return number in this.getRange();
    }

    // returning constructor
    return OctodLimiter;
  })
