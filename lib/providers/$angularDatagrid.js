
  .provider('$angularDatagrid', function () {
    /**
     * configuration Object
     * @static
     * @type {Object}
     */
    var config = {
      debug: false,
      locale: {
        __default: {
          browsingPage: 'Browsing page',
          browsingPageOf: 'of',
          loadingError: 'Error while loading datas. Please refresh your browser.',
          loadingProgress: 'Loading, please wait.',
          pageFirst: 'First page',
          pageLast: 'Last page',
          rowsPerPage: 'Rows per page',
          totalPages: 'total pages.'
        },
        'it-it': {
          browsingPage: 'Guardando la pagina',
          browsingPageOf: 'di',
          loadingError: 'Errore durante il caricamento dei dati. Prego ricaricare la pagina.',
          loadingProgress: 'Sto caricando, aspetta ancora un pochino.',
          pageFirst: 'Prima pagina',
          pageLast: 'Ultima pagina',
          rowsPerPage: 'Righe per pagina',
          totalPages: 'pagine totali.'
        }
      },
      partials: {
        path: ''
      }
    };

    /**
     * $get main function while using the provider in an angular injected function
     * @return {Object}
     */
    this.$get = function () {
      return {
        addLocal: function (name, config) {
          var exists = config.locale[name];
          if (!exists) return config.locale[name] = angular.extend(config.locale.__default, config);
          config.locale[name] = angular.extend(exists, config);
        },
        /**
         * returns debug querystring. A simple hack to avoid caching
         * @static
         * @return {String}
         */
        getDebugQuerystring: function () {
          return config.debug ? '?datetime='+ Date.now() : '';
        },
        /**
         * returns localized object if present
         * @static
         * @return {Object}
         */
        getLocale: function (localeName) {
          return config.locale[localeName] ? config.locale[localeName] : config.locale.__default;
        },
        /**
         * the partials path. Useful to set where the directive should pick the view
         * @static
         * @type {String}
         */
        partialsPath: config.partials.path
      };
    }

    /**
     * sets debugmode on/off
     * @static
     * @param  {Boolean} debugmode
     * @return {Undefined}
     */
    this.debug = function (debugmode) {
      config.debug = debugmode;
    }

    /**
     * adds a localization object
     * @static
     * @param  {String} localeName the i18n locale name
     * @param  {Object:string} config     a set of keys: translations
     * @return {Undefined}
     */
    this.localeAdd = function (localeName, config) {
      config.locale[localeName] = config;
    }

    /**
     * sets the partialsPath parameter used by $get.partialsPath
     * @static
     * @param {String} folder
     */
    this.setPartialsFolder = function (folder) {
      if (typeof folder === 'string') config.partials.path = folder;
    }
  })
