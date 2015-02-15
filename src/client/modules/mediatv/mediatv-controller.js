angular.module('koan.common').controller('MediaTVCtrl', function ($scope, media, $injector) {

    var service = null;
        currentResourceId = null
        isPlaying = false;

    $scope.player = 'No media selected.';

    $scope.playResource = function(resourceId) {

        if(currentResourceId == resourceId && service != null) {
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

        // fetch the resource
        media.resource.fetch(resourceId)
        .success(function(resource){
            service = $injector.get(resource.type + 'Service');
            $('.player').html(service.player.getHTML(resource));
            $('.resource-infos').html(service.player.getInfos(resource));
            service.player.initialize();
            isPlaying = true;
        });
    };

});