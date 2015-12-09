/**
 * IAngularDatagrid module
 * available interfaces
 * 		IAngularDatagridCellOptions
 *   	IAngularDatagridCell
 *    IAngularDatagridLimiter
 *    IAngularDatagridPaginationConfig
 *    IAngularDatagridPagination
 *    IAngularDatagridRowSchema
 *    IAngularDatagridRow
 */
export module IAngularDatagrid {
  /**
   * angular datagrid interface
   * @requires T interface for rows array
   */
  export interface IAngularDatagrid<T> {
    constructor(rows: Array<T>, schema: IAngularDatagridRowSchema, config: IAngularDatagridOptions);

    /**
     * callbable inside a click/change event
     * sets new grid params
     */
    asyncInit(config: { pageNumber?: number, pagers?: Array<number>, rows: Array<T> });
    getFirstPage(): Array<IAngularDatagridRow<T>>;
    getLastPage(): Array<IAngularDatagridRow<T>>;
    getPage(pageNumber: number): Array<IAngularDatagridRow<T>>;
    getPagers(): Array<number>;
    getPaginators(): Array<number>;
    getRowsAll(): Array<IAngularDatagridRow<T>>;
    getTranslated(key: string): string;
    init(): void;
    inRange(pageNumber: number): boolean;
    isCurrentPage(pageNumber: number): boolean;
    isCurrentPager(limit: number): boolean;
    isPaginable(): boolean;
    isVisible(): boolean;
    pageDisplay(): number;
    pageDisplayTotal(): number;
    redraw(): void;
    setCurrentPage(pageNumber: number): void;
    setLimit(limit: number): void;
    setPage(pageNumber: number): void;
    setPageCount(count: number): void;
    setPagers(pagers: number): void;
    setRows(rows: Array<T>): void;
    setSchema(schemaObject: IAngularDatagridRowSchema): void;
    showStats(): boolean;
  }

  /**
   * this interface describes how a cell should be configured
   */
  export interface IAngularDatagridCellOptions {
    /**
     * invoked on the change event bound to the cell input/select element
     * @type {Function}
     */
    changeCallback?: Function;
    /**
     * invoked on the click event bound to the cell
     * @type {Function}
     */
    clickCallback?: Function;
    /**
     * a css class string applied both on the th and td elements
     * @type {string}
     */
    css?: string;
    /**
     * a css class string applied only on the td elements
     * @type {string}
     */
    childCss?: string;
    /**
     * circular reference
     * @type {IAngularDatagridCellOptions}
     */
    options?: IAngularDatagridCellOptions;
    /**
     * enables/disables inline editing for the current cell
     * @default false
     * @type {boolean}
     */
    editable?: boolean;
    /**
     * a callback which hides the current column
     * @type {Function}
     * @return {boolean}
     */
    hide?: Function;
    /**
     * a boolean which forces the cell value to be trusted as html
     * @type {boolean}
     */
    html?: boolean;
    /**
     * the row object string
     * @required
     * @type {string}
     */
    key: string;
    /**
     * property used for inline editing
     * @type {any}
     */
    model?: any;
    /**
     * the th text
     * @required
     * @type {string}
     */
    name: string;
    /**
     * inline style applied to both th and td elements
     * @type {[type]}
     */
    style?: string;
    /**
     * the value type
     * @type {string}
     */
    type?: string;
    /**
     * if a callback is given, this callback will process a passing value
     * the returning value will be rendered as td text
     * @type {Function}
     */
    value?: Function | any;
  }

  export interface IAngularDatagridCell extends IAngularDatagridCellOptions {
    // methods
    constructor(config: IAngularDatagridCellOptions);
    /**
     * invoked on cell change
     */
    change(): void;
    /**
     * invoked on cell click
     */
    click(): void;
    /**
     * returns cell css string
     * @return {string}
     */
    getCss(): string;
    /**
     * returns td css string
     * @return {string}
     */
    getChildCss(): string;
    /**
     * returns trusted html string
     * @return {string}
     */
    getHtml(): string;
    /**
     * returns inline style
     * @return {string}
     */
    getStyle(): string;
    /**
     * returns computed value
     * @return {any}
     */
    getValue(): any;
    /**
     * returns if the column is hidden or not
     * @return {boolean}
     */
    ishidden(): boolean;
    /**
     * restores cell value
     */
    restoreValue(): void;
    /**
     * undos change
     */
    undo(): void;
    /**
     * updates value
     */
    updateValue(): void;
  }

  export interface IAngularDatagridLimiter {
    config: IAngularDatagridPaginationConfig;
    pagers: Array<any>;
    pagersVisible: Array<number>;
    // methods
    constructor(pagers, config);
    /**
     * returns limiter range
     * @return {Array<number>}
     */
    getRange(): Array<number>;
    /**
     * returs if the page number is into the current range
     * @param  {number}  pageNumber
     * @return {boolean}
     */
    inRange(pageNumber: number): boolean;
    /**
     * sets current page
     * @param  {number} pageNumber
     * @return {void}
     */
    setCurrentPage(pageNumber: number);
  }

  export interface IAngularDatagridOptions {

  }

  export interface IAngularDatagridPaginationConfig {
    /**
     * current limit
     * @type {number}
     */
    limit?: number;
    /**
     * current pagers
     */
    pagers?: Array<number>;
  }

  export interface IAngularDatagridPagination<T> {
    /**
     * pagination config
     * @type {IAngularDatagridPaginationConfig}
     */
    config: IAngularDatagridPaginationConfig;
    /**
     * pagination rows
     * @type {Array<IAngularDatagridRow>}
     */
    rows: Array<T>;
    /**
     * pagination rows length
     * @type {number}
     */
    rowsLength: number;
    // methods
    /**
     * gets first page
     * @return {Array<IAngularDatagridRow>} a set of rows
     */
    getFirstPage(): Array<T>;
    /**
     * gets last page
     * @return {Array<IAngularDatagridRow>} a set of rows
     */
    getLastPage(): Array<T>;
    /**
     * gets page {pageNumber}
     * @param  {number}                     pageNumber the page you are requesting
     * @return {Array<IAngularDatagridRow>}            a set of rows
     */
    getPage(pageNumber: number): Array<T>;
    /**
     * gets the page count
     * @return {number}
     */
    getPageCount(): number;
    /**
     * gets the pagers
     * @return {Array<number>}
     */
    getPagers(): Array<number>;
    /**
     * gets the pages
     * @return {Array<number>}
     */
    getPages(): Array<number>;
    /**
     * returns if the instance has pages
     * @return {boolean}
     */
    hasPages(): boolean;
    /**
     * returns if the passed pageNumber is the curret one
     * @param  {number}  pageNumber
     * @return {boolean}
     */
    isCurrentPage(pageNumber: number): boolean;
    /**
     * returns if the passed limit is the current one
     * @param  {number}  limit
     * @return {boolean}
     */
    isCurrentLimit(limit: number): boolean;
    /**
     * sets a limit
     * @param {number} limit
     */
    setLimit(limit: number): void;
    /**
     * sets a page
     * @param {number} pageNumber
     */
    setPage(pageNumber: number): void;
  }

  export interface IAngularDatagridRowSchema extends Array<IAngularDatagridCellOptions> {}

  export interface IAngularDatagridRow<T> {
    /**
     * an array of IAngularDatagridCell;
     */
    cells: Array<IAngularDatagridCell>;
    /**
     * current row object
     * @type {T}
     */
    row: T;
    /**
     * pristine row object
     * @type {T}
     */
    rowCache: T;
    /**
     * datagrid schema object
     * @type {TSchema}
     */
    schema: IAngularDatagridRowSchema;
    // methods
    constructor(row: T, schema: IAngularDatagridRowSchema);
    /**
     * instanciates the cells
     */
    buildCells(): void;
    /**
     * empties the row
     */
    empty(): void;
    /**
     * restores the row reinstancing each cell
     */
    restore(): void;
    /**
     * updates the row
     */
    update(): void;
  }
}
