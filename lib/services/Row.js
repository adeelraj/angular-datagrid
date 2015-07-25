
  .service('OctodRow', ['OctodCell', function (OctodCell) {
    /**
     * Row constructor
     * @param {Object} row    the row Object
     * @param {Object} schema datagrids' schema Object
     */
    function OctodRow (row, schema) {
      this.cells = [];
      this.row = row;
      this.rowCache = row;
      this.schema = schema;
    }

    /**
     * builds cells array
     * @return {Undefined}
     */
    OctodRow.prototype.buildCells = function () {
      this.schema.forEach(function (schemaObject) {
        var cellInstance = new OctodCell(schemaObject, this.row);
        cellInstance.value = typeof schemaObject.value === 'function' ? schemaObject.value(this.row[schemaObject.key]) : this.row[schemaObject.key];
        this.cells.push(cellInstance);
      }, this);
    }

    /**
     * empties cells set
     * @return {Undefined}
     */
    OctodRow.prototype.empty = function () {
      this.cells = [];
    }

    /**
     * restores the row to the original status
     * @return {Undefined}
     */
    OctodRow.prototype.restore = function () {
      this.row = this.rowCache;
      this.buildCells();
    }

    /**
     * updates original object with the current values
     * @return {Undefined}
     */
    OctodRow.prototype.update = function () {
      this.cells.forEach(function (cellObject) {
        this.row[cellObject.key] = cellObject.value;
      }, this);
    }

    // returns OctodRow
    return OctodRow;
  }])
