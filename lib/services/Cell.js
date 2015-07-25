
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
      this.changeCallback = config.change || noop;
      this.css = config.css;
      this.clickCallback = config.click || noop;
      this.editable = config.editable;
      this.hide = config.hide || noop;
      this.key = config.key;
      this.model = null;
      this.name = config.name;
      this.style = config.style;
      this.type = config.type;
      this.value = null;
    }

    /**
     * calls change event on the cell instanced
     * @return {Undefined}
     */
    OctodCell.prototype.change = function () {
      this.changeCallback.call(this);
      this.updateValue();
    }

    /**
     * click event
     * @return {Undefined}
     */
    OctodCell.prototype.click = function () {
      this.clickCallback.call(this);
    }

    /**
     * returns css or calls the css function
     * @return {String}
     */
    OctodCell.prototype.getCss = function () {
      return typeof this.css === 'function' ? this.css.call(this) : this.css;
    }

    /**
     * sets model and valueCache
     * returns value or calls the value function
     * @return {Any}
     */
    OctodCell.prototype.getValue = function () {
      this.model = this.valueCache = typeof this.value === 'function' ? this.value() : this.value;
      return this.model;
    }

    /**
     * returns true if the cell content is hidden
     * @return {Boolean}
     */
    OctodCell.prototype.ishidden = function () {
      return this.hide();
    }

    /**
     * restore values to previous value
     * @return {Undefined}
     */
    OctodCell.prototype.restoreValue = function () {
      this.value = this.model = this.valueCache;
    }

    /**
     * exits from edit mode and resets model to previous value
     * @return {Undefined}
     */
    OctodCell.prototype.undo = function () {
      console.log(123)
      this.editable = false;
      this.model = this.value;
    }

    /**
     * updates the value
     * @return {Undefined}
     */
    OctodCell.prototype.updateValue = function () {
      this.value = this.model;
    }

    // returning OctodCell constructor
    return OctodCell;
  })
