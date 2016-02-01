
  .directive('ngDatagrid', ['AngularDatagrid', '$angularDatagrid', function (AngularDatagrid, $angularDatagrid) {
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
          $scope.$watchCollection($attrs.rows, function () {
            $scope.datagrid = new AngularDatagrid($scope.$eval($attrs.rows) || [], schema, config);
          });
        } else {
          $scope.datagrid = new AngularDatagrid(rows, schema, config);
        }
      },
      restrict: 'E',
      replace: true,
      scope: true,
      templateUrl: function () {
        return $angularDatagrid.partialsPath +'/angular-datagrid.html'+ $angularDatagrid.getDebugQuerystring();
      },
      transclude: true
    }
  }])
