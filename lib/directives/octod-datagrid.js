
  .directive('octodDatagrid', ['OctodDatagrid', '$octodDatagrid', function (OctodDatagrid, $octodDatagrid) {
    return {
      controller: ['$scope', function ($scope) {
        this.datagrid = $scope.$new();
      }],
      controllerAs: 'datagrid',
      link: function ($scope, $element, $attrs) {
        var config = $attrs.config ? $scope.$eval($attrs.config) : {};
        var rows = $attrs.rows ? $scope.$eval($attrs.rows) : [];
        var schema = $attrs.schema ? $scope.$eval($attrs.schema) : [];
        $scope.datagrid = new OctodDatagrid(rows, schema, config);
        $scope.datagrid.title = $attrs.datagridTitle ? $scope.$eval($attrs.datagridTitle) : false;
      },
      restrict: 'E',
      replace: true,
      templateUrl: function () {
        return $octodDatagrid.partialsPath +'/octod-datagrid.html';
      }
    }
  }])
