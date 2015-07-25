
  .directive('odEsc', function () {
    return {
      link: function ($scope, $element, $attrs) {
        if (!$attrs.odEsc) return;

        angular.element($element).on('keydown', function (event) {
          if (event.keyCode === 27) $scope.$eval($attrs);
        });
      },
      restrict: 'A'
    }
  })
