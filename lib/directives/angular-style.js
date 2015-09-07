
  .directive('odStyle', function () {
    return {
      link: function ($scope, $element, $attrs) {
        if (!$attrs.odStyle) return;
        try {
          angular.element($element).attr('style', $scope.$eval($attrs.odStyle));
        } catch (error) {
          angular.element($element).attr('style', $attrs.odStyle);
        }
      },
      restrict: 'A'
    }
  })
