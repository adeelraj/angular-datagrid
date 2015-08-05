
  .provider('$octodDatagrid', function () {
    var config = {
      debug: false,
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
        /**
         * returns debug querystring. A simple hack to avoid caching
         * @return {String}
         */
        getDebugQuerystring: function () {
          return config.debug ? '?datetime='+ Date.now() : '';
        },
        /**
         * the partials path. Useful to set where the directive should pick the view
         * @type {String}
         */
        partialsPath: config.partials.path
      };
    }

    /**
     * sets debugmode on/off
     * @param  {Boolean} debugmode
     * @return {Undefined}
     */
    this.debug = function (debugmode) {
      config.debug = debugmode;
    }

    /**
     * sets the partialsPath parameter used by $get.partialsPath
     * @param {String} folder 
     */
    this.setPartialsFolder = function (folder) {
      if (typeof folder === 'string') config.partials.path = folder;
    }
  })
