
  .directive('odEnter', function () {
    return {
      link: function ($scope, $element, $attrs) {
        if (!$attrs.odEnter) return;
        angular.element($element).on('keyup', function (event) {
          var keycode = event.keyCode === 13;
          if (!keycode) return;
          if ($attrs.odEnterKill) event.preventDefault();

          return $scope.$eval($attrs.odEnter);
        });
      },
      restrict: 'A'
    }
  })
