angular.module('koan.common').directive('mediatv', function(media, $injector, $sce, $anchorScroll, $location) {
    return {
        templateUrl: '/modules/mediatv/mediatv.html',
        controller: function($scope) {

            $scope.queueHistory = [];
            $scope.player = {
                embed: null,
                infos: null
            };
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
                .success(function(resource) {
                    service = $injector.get(resource.type + 'Service');
                    $scope.player.embed = $sce.trustAsHtml(service.player.getHTML(resource));
                    service.player.initialize();
                    var html = service.player.getQueueHTML(resource);
                    $scope.queueHistory.unshift($sce.trustAsHtml(html));
                    $scope.addItemToQueue(resourceId, html);
                    isPlaying = true;
                    $location.hash('mediatv');
                    $anchorScroll();
                });
            };

            $scope.addItemToQueue = function(resourceId, html) {
                media.resource.addResourceToQueue(resourceId, html)
            };

            $scope.loadQueue = function() {
                media.resource.loadQueue($scope.common.user.id).success(function (items) {
                    items.forEach(function (item) {
                        $scope.queueHistory.unshift($sce.trustAsHtml(item.html));
                    });
                });
            };

            $scope.loadQueue();
        }
    };
});
