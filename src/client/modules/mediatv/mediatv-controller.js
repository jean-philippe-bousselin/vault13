angular.module('koan.common').controller('MediaTVCtrl', function ($scope, media, $injector) {

    var service;
        currentResourceId = null
        isPlaying = false;

    $scope.player = 'No media selected.';

    $scope.playResource = function(resourceId) {

        if(currentResourceId == resourceId) {
            if(isPlaying) {
                service.player.trigger('pause');
                isPlaying = false;
            } else {
                service.player.trigger('play');
                isPlaying = true;
            }
            return;
        }

        currentResourceId = resourceId;

        // show loader
        $('.loading').removeClass('hide');
        // fetch the resource
        media.resource.fetch(resourceId)
        .success(function(resource){
            // replace content with generated loader
            service = $injector.get(resource.type + 'Service');
            $('.player').html(service.player.getHTML(resource));
            $('.resource-infos').html(service.getResourceInfosAsHTML(resource));
            // hide loader
            $('.loading').addClass('hide');
            isPlaying = true;
        });
    };

});