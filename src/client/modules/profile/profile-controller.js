'use strict';

/**
 * Profile controller gives the user the means to view/edit their public profile info.
 */

angular.module('koan.profile').controller('ProfileCtrl', function ($scope, api) {

  $scope.user = $scope.common.user;
  $scope.newPassword = {current: '', newValue: '', repeatValue: ''};
  $scope.newPicture = null;
  $scope.error = null;
  $scope.success = null;

  $scope.updatePassword = function ($event) {

    if (!$scope.newPassword.newValue.length || !$scope.newPassword.repeatValue.length) {
      console.log('at least one field is empty');
      $event.preventDefault();
      return;
    }

    if($scope.newPassword.newValue != $scope.newPassword.repeatValue){
      console.log('new password and repeat mismatch');
      $event.preventDefault();
      return;
    }

    $scope.user.password = $scope.newPassword.newValue;

    api.users.update({user: $scope.user})
        .success(function () {
          $scope.newPassword.newValue = '';
          $scope.newPassword.repeatValue = '';
          $scope.success = 'Password updated.';
        })
        .error(function () {
          $scope.error = 'An error happened.';
        });
  };

  $scope.updatePicture = function (files) {

    var file = files[0];
    var img = document.createElement("img");
    img.classList.add("obj");
    img.file = file;
    var reader = new FileReader();
    reader.onload = (function(aImg) {
      return function(e) {
        api.users.update({user: {id: $scope.user.id, picture: e.target.result.substr(e.target.result.indexOf(',') + 1)}})
        .success(function () {
          $scope.success = 'image updated.';
        })
        .error(function () {
          $scope.error = 'An error happened.';
        });
      };
    })(img);
    reader.readAsDataURL(file);
  };

});