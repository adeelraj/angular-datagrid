
  .provider('$octodDatagrid', function () {
    var config = {
      partials: {
        path: ''
      }
    };

    this.$get = function () {
      return {
        partialsPath: config.partials.path
      };
    }

    this.setPartialsFolder = function (folder) {
      if (typeof folder === 'string') config.partials.path = folder;
    }
  })
