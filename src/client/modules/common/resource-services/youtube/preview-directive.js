angular.module('koan.common').directive('youtube', function($compile) {
    return {
        scope: {text: '@'},
        template: '<p ng-click="add()">{{text}}</p>',
        controller: function ($scope, $element) {
            debugger;
            $scope.add = function () {
                var el = $compile("<test text='n'></test>")($scope);
                $element.parent().append(el);
            };
        }
    }
});