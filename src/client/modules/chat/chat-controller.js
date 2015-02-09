angular.module('koan.common').controller('ChatCtrl', function ($scope, api) {

    var user = $scope.common.user;
    $scope.shoutBox = {message: '', disabled: false};
    $scope.shouts = [];

    api.shouts.list().success(function (shouts) {
        $scope.shouts = shouts;
    });

    $scope.shout = function ($event) {

        if (!$scope.shoutBox.message.length || $scope.shoutBox.disabled) {
            $event.preventDefault();
            return;
        }

        $scope.shoutBox.disabled = true;

        api.shouts.create({message: $scope.shoutBox.message})
            .success(function (shout) {
                // only add the comment if we don't have it already in the post's comments list to avoid dupes
                if (!_.some($scope.shouts, function (s) {
                        return s.id === shout.id;
                    })) {
                    $scope.shouts.push({
                        id: shout.id,
                        from: user,
                        message: $scope.shoutBox.message,
                        createdTime: new Date()
                    });
                }
                // clear the post box and enable it
                $scope.shoutBox.message = '';
                $scope.shoutBox.disabled = false;

                $scope.$broadcast('newShoutAdded');
            })
            .error(function () {
                // don't clear the post box but enable it so the user can re-try
                $scope.shoutBox.disabled = false;
            });
    };

    api.shouts.created.subscribe($scope, function (shout) {
        // only add the post if we don't have it already in the posts list to avoid dupes
        if (!_.some($scope.shouts, function (s) {
                return s.id === shout.id;
            })) {
            $scope.shouts.push(shout);
        }
    });

});