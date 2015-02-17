angular.module('koan.common').directive('mediatv', function(media, $injector, $sce, $anchorScroll, $location) {
    return {
        templateUrl: '/modules/mediatv/mediatv.html',
        controller: function($scope) {

            var service = null;

            $scope.currentResource = null;
            $scope.queueHistory = [];
            $scope.player = {
                embed: null,
                infos: null
            };
            $scope.playResource = function(resourceId) {
                // fetch the resource
                media.resource.fetch(resourceId)
                .success(function(resource) {
                    service = $injector.get(resource.type + 'Service');
                    $scope.player.embed = $sce.trustAsHtml(service.player.getHTML(resource));
                    service.player.initialize();
                    $scope.addResourceToQueue(resource);
                    $scope.currentResource = resource;
                    $(".mediatv-container").animate({ scrollTop: 0 });
                });
            };

            $scope.addResourceToQueue = function(resource) {
                media.resource.addResourceToQueue(resource)
                .success(function() {
                    $scope.queueHistory.forEach(function (item) {
                      if(item.resourceId == resource.resourceId) {
                          $scope.queueHistory.splice($scope.queueHistory.indexOf(item), 1);
                      }
                    });
                    $scope.queueHistory.unshift(resource);
                });
            };

            $scope.loadQueue = function() {
                media.resource.loadQueue().success(function (items) {
                    items.forEach(function(item){
                        $scope.queueHistory.unshift(item.resource);
                    });
                });
            };

            $scope.loadQueue();
        }
    };
});
