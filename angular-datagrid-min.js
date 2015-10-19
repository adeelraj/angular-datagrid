(function(){"use strict";var t=this.angular;t.module("ng-datagrid",[]).directive("ngDatagrid",["AngularDatagrid","$angularDatagrid",function(t,i){return{controller:["$scope",function(t){this.datagrid=t.$new()}],controllerAs:"datagrid",link:function(i,e,n){var o=n.config?i.$eval(n.config):{},r=n.rows?i.$eval(n.rows):[],a=n.schema?i.$eval(n.schema):[];i.datagrid.title=n.datagridTitle?i.$eval(n.datagridTitle):!1,n.rows?i.$watch(n.rows,function(){i.datagrid=new t(i.$eval(n.rows)||[],a,o)}):i.datagrid=new t(r,a,o)},restrict:"E",replace:!0,templateUrl:function(){return i.partialsPath+"/angular-datagrid.html"+i.getDebugQuerystring()},transclude:!0}}]).directive("odEnter",function(){return{link:function(i,e,n){n.odEnter&&t.element(e).on("keyup",function(t){var e=13===t.keyCode;if(e)return n.odEnterKill&&t.preventDefault(),i.$eval(n.odEnter)})},restrict:"A"}}).directive("odEsc",function(){return{link:function(i,e,n){n.odEsc&&t.element(e).on("keydown",function(t){27===t.keyCode&&i.$eval(n)})},restrict:"A"}}).directive("odStyle",function(){return{link:function(i,e,n){if(n.odStyle)try{t.element(e).attr("style",i.$eval(n.odStyle))}catch(o){t.element(e).attr("style",n.odStyle)}},restrict:"A"}}).provider("$angularDatagrid",function(){var i={debug:!1,locale:{__default:{browsingPage:"Browsing page",browsingPageOf:"of",loadingError:"Error while loading datas. Please refresh your browser.",loadingProgress:"Loading, please wait.",pageFirst:"First page",pageLast:"Last page",rowsPerPage:"Rows per page",totalPages:"total pages."},"it-it":{browsingPage:"Guardando la pagina",browsingPageOf:"di",loadingError:"Errore durante il caricamento dei dati. Prego ricaricare la pagina.",loadingProgress:"Sto caricando, aspetta ancora un pochino.",pageFirst:"Prima pagina",pageLast:"Seconda pagina",rowsPerPage:"Righe per pagina",totalPages:"pagine totali."}},partials:{path:""}};this.$get=function(){return{addLocal:function(i,e){var n=e.locale[i];return n?void(e.locale[i]=t.extend(n,e)):e.locale[i]=t.extend(e.locale.__default,e)},getDebugQuerystring:function(){return i.debug?"?datetime="+Date.now():""},getLocale:function(t){return i.locale[t]?i.locale[t]:i.locale.__default},partialsPath:i.partials.path}},this.debug=function(t){i.debug=t},this.localeAdd=function(t,i){i.locale[t]=i},this.setPartialsFolder=function(t){"string"==typeof t&&(i.partials.path=t)}}).service("AngularCell",["$sce",function(i){function e(){}function n(t,i){this.changeCallback=t.change||e,this.clickCallback=t.click||e,this.css=t.css,this.childCss=t.childCss,this.options=t.options||"",this.editable=t.editable,this.hide=t.hide||e,this.html=t.forceHtml,this.key=t.key,this.model=null,this.name=t.name,this.style=t.style,this.type=t.type,this.value=t.value||null,this.$row=i}return n.prototype.change=function(){this.changeCallback.call(this,this.$row),this.updateValue()},n.prototype.click=function(){this.clickCallback.call(this,this.$row)},n.prototype.getCss=function(){return"function"==typeof this.css?this.css.call(this,this.$row):this.css},n.prototype.getChildCss=function(){return"function"==typeof this.childCss?this.childCss.call(this,this.$row):this.childCss},n.prototype.getHtml=function(){return i.trustAsHtml(this.getValue())},n.prototype.getStyle=function(){return this.style},n.prototype.getValue=function(){var t=this.$row[this.key];return this.model=this.valueCache="function"==typeof this.value?this.value.call(this,t,this.$row):t,this.model},n.prototype.ishidden=function(){return this.hide.call(this,this.$row)},n.prototype.restoreValue=function(){this.value=this.model=t.copy(this.valueCache)},n.prototype.undo=function(){this.editable=!1,this.model=this.value},n.prototype.updateValue=function(){this.value=this.model},n}]).service("AngularRow",["AngularCell",function(i){function e(t,i){this.cells=[],this.row=t,this.rowCache=t,this.schema=i}return e.prototype.buildCells=function(){this.schema.forEach(function(t){var e=new i(t,this.row);e.$$row=this,e.getValue(),this.cells.push(e)},this)},e.prototype.empty=function(){this.cells=[]},e.prototype.restore=function(){this.row=t.copy(this.rowCache),this.buildCells()},e.prototype.update=function(){this.cells.forEach(function(t){this.row[t.key]=t.value},this)},e}]).service("AngularPagination",function(){function t(t){return Object.prototype.toString.call(t)}function i(i,e){if("[object Array]"===!t(i))throw new TypeError("AngularPagination requires a rows:[object Array], provided"+t(i));this.config=e||{},this.config.limit=e.limit||10,this.config.pagers=e.pagers||[10,20,30],this.rows=i||[],this.rowsLength=e.rowsLength||i.length}return i.prototype.getFirstPage=function(){return this.getPage(1)},i.prototype.getLastPage=function(){return this.getPage(this.getPageCount())},i.prototype.getPage=function(t){var i=[];if(!this.hasPages())return i;t&&(this.config.currentPage=t);for(var e=0;e<this.config.limit;e++){var n=(this.config.currentPage-1)*this.config.limit+i.length;this.rows[n]&&i.push(this.rows[n])}return i},i.prototype.getPageCount=function(){return this.config.pageCount=Math.ceil(this.rowsLength/this.config.limit)},i.prototype.getPagers=function(){return this.config.pagers},i.prototype.getPages=function(){if(this.hasPages()){for(var t=[],i=1;t.length<this.getPageCount();)t.push(i),i++;return t}},i.prototype.hasPages=function(){return this.getPageCount()>0},i.prototype.isCurrentPage=function(t){return(this.config.$currentPage||this.config.currentPage)===t},i.prototype.isCurrentLimit=function(t){return this.config.limit===t},i.prototype.setLimit=function(t){return!t in this.config.pagers?!1:(this.config.currentPage=1,this.config.limit=t,!0)},i.prototype.setPage=function(t){this.hasPages()&&(this.config.currentPage=t)},i}).service("AngularLimiter",function(){function t(t,i){this.config=i||{},this.pagers=t||[],this.pagersVisible=[]}function i(t){return this.pagersVisible.filter(function(i){return i===t}).length>0}function e(){var t=Math.floor(this.config.limit/2),i=this.config.limit%2===0,e=this.config.$currentPage||this.config.currentPage,o=e-t,r=e+t;return i&&(r-=1),1>=o&&(o=1,r=this.config.limit),r>=n.call(this)&&(r=n.call(this),o=r-2*t,i&&(o+=1)),this.pagersVisible=[],this.pagersVisible=this.pagers.filter(function(t){return t>=o&&r>=t},this)}function n(){return this.pagers[this.pagers.length-1]}return t.prototype.getRange=function(){return e.call(this)},t.prototype.inRange=function(t){return i.call(this,t)},t.prototype.setCurrentPage=function(t){this.config.currentPage=t},t}).service("AngularDatagrid",["$angularDatagrid","AngularRow","AngularCell","AngularPagination","AngularLimiter","$http",function(i,e,n,o,r,a){function s(e,n,o){this.rows=[],this.rowsCache=e,this.schema=n,this.config=t.extend(c,o),this.config.translations=i.getLocale(o.locale)}function g(t,i,e,n){var o=new s(t,i,e);return o.init(!0),"function"==typeof e.onPageSelect&&e.onPageSelect.call(o,1),g.cache[n||Date.now()]=o,o}var c={locale:"__default",onPageSelect:null,pagination:{currentPage:1,limit:10,pagers:[10,20,30],visible:!0},paginator:{currentPage:1,limit:5,visible:!0},showStats:!0,translations:{},visible:!0};return s.Cell=n,s.Limiter=r,s.Pagination=o,s.Row=e,s.prototype.asyncInit=function(t){var i=t.pageNumber||this.config.pagination.currentPage,e=t.pagers||this.config.pagination.pagers,n=t.rows||[],o=t.rowsTotal;this.getPage(i),this.setRows(n),this.setPageCount(o),this.setPagers(e),this.setCurrentPage(i),this.init()},s.prototype.getFirstPage=function(){this.pagination.getFirstPage(),(this.config.onPageSelect||t.noop).call(this,1)},s.prototype.getLastPage=function(){this.pagination.getLastPage(),(this.config.onPageSelect||t.noop).call(this,this.pagination.getPageCount())},s.prototype.getPage=function(t){var i=t||this.pagination.config.currentPage||1;return this.rows=this.pagination.getPage(i),this.paginator.setCurrentPage(i),this.rows},s.prototype.getPagers=function(){return this.pagination.getPagers()},s.prototype.getPaginators=function(){var t=this.pagination.getPages();return this.paginator.getRange(),t},s.prototype.getRowsAll=function(){return this.rowsCache},s.prototype.getTranslated=function(t){return this.config.translations[t]||""},s.prototype.init=function(){return this.redraw(),this.pagination=new o(this.rows,this.config.pagination),this.pagination.getFirstPage(),this.paginator=new r(this.pagination.getPages(),this.config.paginator),this},s.prototype.inRange=function(t){return this.paginator.inRange(t)},s.prototype.isCurrentPage=function(t){return this.pagination.isCurrentPage(t)},s.prototype.isCurrentPager=function(t){return this.pagination.isCurrentLimit(t)},s.prototype.isPaginable=function(){return this.config.pagination.visible},s.prototype.isVisible=function(){return this.config.visible},s.prototype.pageDisplay=function(){return this.pagination.config.$currentPage||this.config.pagination.currentPage},s.prototype.pageDisplayTotal=function(){return this.pagination.getPageCount()},s.prototype.redraw=function(){this.rows=[],this.rowsCache.forEach(function(t){var i=new e(t,this.schema);i.buildCells(),this.rows.push(i)},this)},s.prototype.setCurrentPage=function(t){t&&"number"==typeof t&&(this.paginator.config.$currentPage=t,this.pagination.config.$currentPage=t)},s.prototype.setLimit=function(t){this.pagination.setLimit(t)&&this.init()},s.prototype.setPage=function(i){this.getPage(i),(this.config.onPageSelect||t.noop).call(this,i,this.config.pagination.limit)},s.prototype.setPagers=function(t){t=Array.isArray(t)?t:[t],this.config.pagination.pagers=t},s.prototype.setPageCount=function(t){t&&"number"==typeof t&&(this.config.pagination.rowsLength=t)},s.prototype.setRows=function(t){return this.rowsCache=t,this.init(),this},s.prototype.setSchema=function(t){"[object Object]"===Object.prototype.toString.call(t)&&(this.schema=t,this.init())},s.prototype.showStats=function(){return this.config.showStats},g.cache={},g.constructor=s,g}])}).call(this);