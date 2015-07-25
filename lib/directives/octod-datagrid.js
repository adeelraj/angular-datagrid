
  .directive('octodDatagrid', ['octodDatagrid', function (octodDatagrid) {
    return {
      controller: ['$scope', function ($scope) {
        this.datagrid = $scope.$new();
      }],
      controllerAs: 'datagrid',
      link: function ($scope, $element, $attrs) {
        var config = $scope.$eval($attrs.config) || {};
        var folder = $scope.$eval($attrs.folder) || '';
        var rows = $scope.$eval($attrs.rows) || [];
        var schema = $scope.$eval($attrs.schema) || [];
        $scope.datagrid = new OctodDatagrid(rows, schema, config);
        $scope.datagrid.partialsFolder = folder;
        $scope.datagrid.title = $attrs.datagridTitle;
      },
      restrict: 'E',
      replace: true,
      templateUrl: function ($scope) {
        return $scope.datagrid.partialsFolder +'partials/octod-datagrid.html';
      }
    }
  }])
