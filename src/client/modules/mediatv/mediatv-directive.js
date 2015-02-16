angular.module('koan.common').directive('mediatv', function(media, $injector, $sce, $anchorScroll, $location) {
    return {
        templateUrl: '/modules/mediatv/mediatv.html',
        controller: function($scope) {

            $scope.currentResourceId = null;

            $scope.queueHistory = [];
            $scope.player = {
                embed: null,
                infos: null
            };
            $scope.playResource = function(resourceId) {
                if($scope.currentResourceId == resourceId && service != null) {
                    if(isPlaying) {
                        service.player.trigger('pause');
                        isPlaying = false;
                    } else {
                        service.player.trigger('play');
                        isPlaying = true;
                    }
                    return;
                }
                $scope.currentResourceId = resourceId;
                // fetch the resource
                media.resource.fetch(resourceId)
                .success(function(resource) {
                    service = $injector.get(resource.type + 'Service');
                    $scope.player.embed = $sce.trustAsHtml(service.player.getHTML(resource));
                    service.player.initialize();
                    var html = service.player.getQueueHTML(resource);
                    $scope.addItemToQueue(resourceId, html);
                    isPlaying = true;

                    $(".mediatv-container").animate({ scrollTop: 0 });
                });
            };

            $scope.addItemToQueue = function(resourceId, html) {
                media.resource.addResourceToQueue(resourceId, html)
                    .success(function() {
                        $scope.queueHistory.forEach(function (item) {
                          if(item.resourceId == resourceId) {
                              $scope.queueHistory.splice($scope.queueHistory.indexOf(item), 1);
                          }
                        });
                        $scope.queueHistory.unshift({
                            resourceId: resourceId,
                            html: $sce.trustAsHtml(html)
                        });
                    });

            };

            $scope.loadQueue = function() {
                media.resource.loadQueue().success(function (items) {
                    items.forEach(function (item) {
                        item.html = $sce.trustAsHtml(item.html);
                        $scope.queueHistory.unshift(item);
                    });
                });
            };

            $scope.loadQueue();
        }
    };
});
