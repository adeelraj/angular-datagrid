import { PaginationConfig } from './pagination-config';
import { Row, RowSet } from './row';

export class Pagination {
  private config: PaginationConfig = new PaginationConfig;
  private _pages: RowSet;

  constructor(config: any, rows: Array<any>) {
    this.config = angular.extend(this.config, config);
  }

  public get(pageNumber: number) {
    return this._pages.getRows();
  }

  public getCount() {
    
  }

  public getFirst() {
    return this.get(1);
  }

  public getLast() {
    return this.get(this.config.rowsLength);
  }

  public getLimitRange() {

  }
}
