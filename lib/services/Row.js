
  .service('AngularRow', ['AngularCell', function (AngularCell) {
    /**
     * Row constructor
     * @param {Object} row    the row Object
     * @param {Object} schema datagrids' schema Object
     */
    function AngularRow (row, schema) {
      this.cells = [];
      this.row = row;
      this.rowCache = row;
      this.schema = schema;
    }

    /**
     * builds cells array
     * @return {Undefined}
     */
    AngularRow.prototype.buildCells = function () {
      this.schema.forEach(function (schemaObject) {
        var cellInstance = new AngularCell(schemaObject, this.row);
        cellInstance.getValue();
        this.cells.push(cellInstance);
      }, this);
    }

    /**
     * empties cells set
     * @return {Undefined}
     */
    AngularRow.prototype.empty = function () {
      this.cells = [];
    }

    /**
     * restores the row to the original status
     * @return {Undefined}
     */
    AngularRow.prototype.restore = function () {
      this.row = angular.copy(this.rowCache);
      this.buildCells();
    }

    /**
     * updates original object with the current values
     * @return {Undefined}
     */
    AngularRow.prototype.update = function () {
      this.cells.forEach(function (cellObject) {
        this.row[cellObject.key] = cellObject.value;
      }, this);
    }

    // returns AngularRow
    return AngularRow;
  }])
