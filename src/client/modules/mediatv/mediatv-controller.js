angular.module('koan.common').controller('MediaTVCtrl', function ($scope, media, $injector) {

    var service;

    $scope.player = 'No media selected.';

    $scope.playResource = function(resourceId) {
        // show loader
        $('.loading').removeClass('hide');
        // fetch the resource
        media.resource.fetch(resourceId)
        .success(function(resource){
            // replace content with generated loader
            service = $injector.get(resource.type + 'Service');
            $('.player').html(service.getHTMLPlayer(resource));
            $('.resource-infos').html(service.getResourceInfosAsHTML(resource));
            // hide loader
            $('.loading').addClass('hide');
        });
    };

});