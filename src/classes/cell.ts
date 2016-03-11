'use strict';

const SCE = angular.injector(['ng']).get<angular.ISCEService>('$sce');

export class Cell {
  private _data: CellConfig;
  private _row: any;

  constructor(data: CellConfig, rowinstance: any) {
    let cfgInstance = new CellConfig;
    this._data = angular.extend(cfgInstance, data);
    this._row = rowinstance;
    if (this._data.forceHtml && !!this._data.html) this._data.html = this._data.forceHtml;
  }

  private getComputedValue() {
    return this._row[this._data.key];
  }

  public hasStyle(): boolean {
    return !!this._data.style && this._data.style.length > 0;
  }

  public isEditable(): boolean {
    return this._data.editable;
  }

  public isHtml(): boolean {
    return this._data.html;
  }

  public isVisible(): boolean {
    return typeof this._data.hide === 'boolean' ? this._data.hide : this._data.hide(this.getValue(), this._row);
  }

  public getChildCss(): string {
    return typeof this._data.childCss === 'string' ? this._data.childCss : this._data.childCss(this);
  }

  public getCss(): string {
    return typeof this._data.css === 'string' ? this._data.css : this._data.css(this);
  }

  public getStyle(): string {
    return this._data.style;
  }

  public getValue(): any {
    let _value = this.getComputedValue();
    return typeof this._data.value === undefined ? _value : this._data.value(_value, this._row);
  }

  public getHtml(): string {
    return SCE.trustAsHtml(this.getValue());
  }

  public ngChange(): void {
    if (typeof this._data.ngChange === 'function') this.ngChange();
  }

  public ngClick(): void {
    if (typeof this._data.ngChange === 'function') this.ngChange();
  }

  public ngModelOptions(): any {
    return this._data.ngModelOptions || {};
  }
}

export class CellConfig {
  public childCss: any = '';
  public colspan: number = 1;
  public css: any = '';
  public editable: boolean = false;
  public forceHtml: boolean = false;
  public html: boolean = false;
  public hide: any = false;
  public key: string;
  public model: any;
  public name: string;
  public ngChange: CellConfigCallback = angular.noop;
  public ngClick: CellConfigCallback = angular.noop;
  public ngOptions: string = '';
  public ngModelOptions: any = '';
  public rowspan: number = 1;
  public style: string = '';
  public type: string = 'text';
  public value: CellConfigCallback = angular.noop;
}

export type CellConfigCallback = (... args) => any;
