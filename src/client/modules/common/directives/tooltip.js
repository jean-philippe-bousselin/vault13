angular.module('koan.common').directive('tooltip', function() {
    return {
        link: function (scope, element) {
            element.on('load', function(){
                element.tooltip();
            });
        }
    };
});
