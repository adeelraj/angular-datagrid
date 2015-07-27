
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

    // returning constructor
    return OctodLimiter;
  })
