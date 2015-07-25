
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
      this.css = config.css;
      this.click = config.click || noop;
      this.hide = config.hide || noop;
      this.key = config.key;
      this.name = config.name;
      this.value = null;
    }

    /**
     * click event
     * @return {Undefined}
     */
    OctodCell.prototype.click = function () {
      this.click.call(this);
    }

    /**
     * returns css or calls the css function
     * @return {String}
     */
    OctodCell.prototype.getCss = function () {
      return typeof this.css === 'function' ? this.css() : this.value;
    }

    /**
     * returns value or calls the value function
     * @return {Any}
     */
    OctodCell.prototype.getValue = function () {
      return typeof this.value === 'function' ? this.value() : this.value;
    }

    /**
     * returns true if the cell content is hidden
     * @return {Boolean}
     */
    OctodCell.prototype.ishidden = function () {
      return this.hide();
    }

    // returning OctodCell constructor
    return OctodCell;
  })
