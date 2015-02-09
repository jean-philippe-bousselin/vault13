'use strict';

angular.module('koan.admin').controller('AdminCtrl', function ($scope, AdminService) {

    $scope.newUser = {username: null, password: null};
    $scope.error = null;
    $scope.success = null;
    // add user creation function to scope
    $scope.createUser = function ($event) {
        // don't let the user type in blank lines or submit empty/whitespace only post, or type in something when post is being created
        if (!$scope.newUser.username.length || !$scope.newUser.password.length) {
            $event.preventDefault();
            return;
        }

        AdminService.users.create({name: $scope.newUser.username, password: $scope.newUser.password})
            .success(function (user) {
                $scope.success = 'User created with ID: ' + user.id;
                $scope.newUser.username = null;
                $scope.newUser.password = null;
            })
            .error(function () {
                $scope.error = 'An error happened.';
            });
    };

});