import { Cell } from './cell';
import { CellConfig } from './cell-config';

export class Row {
  private _row: any;
  private _schema: Array<CellConfig>;

  constructor(_schema: Array<CellConfig>, _row: any) {
    this._row = _row;
    this._schema = _schema;
  }

  private makecells(): Array<Cell> {
    let _row = this._schema.map(schemaItem => new Cell(schemaItem, this._row));
    return _row;
  }

  public getRow() {
    this.makecells();
    return this._row;
  }
}


export class RowSet {
  private _rawRows: Array<any> = [];
  private _rows: Array<Row> = [];
  private _schema: Array<CellConfig>;

  constructor(_schema: Array<CellConfig>, _rows: Array<any>) {
    this._rawRows = _rows;
    this._schema = _schema;
  }

  private makerows() {
    let _rows = this._rawRows.map(row => new Row(this._schema, row));
    return _rows;
  }

  public getRows(): Array<Row> {
    let rows = this.makerows();
    return rows;
  }
}
