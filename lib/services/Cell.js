
  .service('AngularCell', ['$sce', function ($sce) {
    /**
     * noop function. It does nothing lol
     * @private
     * @return {Undefined}
     */
    function noop () {};

    /**
     * AngularCell constructor
     * @param {Object} config configuration object
     * @param {Object} row    is the parent row (happens only when instanced by AngularRow constructor)
     */
    function AngularCell (config, row) {
      this.changeCallback = config.change || noop;
      this.clickCallback = config.click || noop;
      this.css = config.css;
      this.childCss = config.childCss;
      this.options = config.options || '';
      this.editable = config.editable;
      this.hide = config.hide || noop;
      this.html = config.forceHtml;
      this.key = config.key;
      this.model = null;
      this.name = config.name;
      this.style = config.style;
      this.type = config.type;
      this.value = config.value || null;
      // accessible when clicking
      this.$row = row;
    }

    /**
     * calls change event on the cell instanced
     * @return {Undefined}
     */
    AngularCell.prototype.change = function () {
      this.changeCallback.call(this, this.$row);
      this.updateValue();
    }

    /**
     * click event
     * @return {Undefined}
     */
    AngularCell.prototype.click = function () {
      this.clickCallback.call(this, this.$row);
    }

    /**
     * returns css or calls the css function
     * @return {String}
     */
    AngularCell.prototype.getCss = function () {
      return typeof this.css === 'function' ? this.css.call(this, this.$row) : this.css;
    }

    /**
     * returns child element css or calls the css function
     * @return {String}
     */
    AngularCell.prototype.getChildCss = function () {
      return typeof this.childCss === 'function' ? this.childCss.call(this, this.$row) : this.childCss;
    }

    /**
     * encapsulates html and trust it
     * @return {String} the html string
     */
    AngularCell.prototype.getHtml = function () {
      return $sce.trustAsHtml(this.getValue());
    }

    /**
     * returns cell instance style
     * @return {Any}
     */
    AngularCell.prototype.getStyle = function () {
      return this.style;
    }

    /**
     * sets model and valueCache
     * returns value or calls the value function
     * @return {Any}
     */
    AngularCell.prototype.getValue = function () {
      var cellValue = this.$row[this.key];
      this.model = this.valueCache = typeof this.value === 'function' ? this.value.call(this, cellValue, this.$row) : cellValue;
      return this.model;
    }

    /**
     * returns true if the cell content is hidden
     * @return {Boolean}
     */
    AngularCell.prototype.ishidden = function () {
      return this.hide.call(this, this.$row);
    }

    /**
     * restore values to previous value
     * @return {Undefined}
     */
    AngularCell.prototype.restoreValue = function () {
      this.value = this.model = angular.copy(this.valueCache);
    }

    /**
     * exits from edit mode and resets model to previous value
     * @return {Undefined}
     */
    AngularCell.prototype.undo = function () {
      this.editable = false;
      this.model = this.value;
    }

    /**
     * updates the value
     * @return {Undefined}
     */
    AngularCell.prototype.updateValue = function () {
      this.value = this.model;
    }

    // returning AngularCell constructor
    return AngularCell;
  }])
