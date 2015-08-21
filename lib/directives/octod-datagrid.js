
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
        $scope.datagrid.title = $attrs.datagridTitle ? $scope.$eval($attrs.datagridTitle) : false;
        if ($attrs.rows) {
          $scope.$watch($attrs.rows, function () {
            $scope.datagrid = new OctodDatagrid($scope.$eval($attrs.rows), schema, config);
          });
        } else {
          $scope.datagrid = new OctodDatagrid(rows, schema, config);
        }
      },
      restrict: 'E',
      replace: true,
      templateUrl: function () {
        return $octodDatagrid.partialsPath +'/octod-datagrid.html'+ $octodDatagrid.getDebugQuerystring();
      }
    }
  }])
