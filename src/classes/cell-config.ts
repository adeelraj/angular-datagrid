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
