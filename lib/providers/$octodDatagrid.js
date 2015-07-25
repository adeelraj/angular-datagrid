
  .provider('$octodDatagrid', function () {
    var config = {
      debug: false,
      partials: {
        path: ''
      }
    };

    this.$get = function () {
      return {
        getDebugQuerystring: function () {
          return config.debug ? '?datetime='+ Date.now() : '';
        },
        partialsPath: config.partials.path
      };
    }

    this.debug = function (debugmode) {
      config.debug = debugmode;
    }

    this.setPartialsFolder = function (folder) {
      if (typeof folder === 'string') config.partials.path = folder;
    }
  })
