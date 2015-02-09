'use strict';

/**
 * Profile module for user profile and related content.
 */

angular
    .module('koan.admin', [
        'ngRoute',
        'koan.common'
    ])
    .config(function ($routeProvider) {
        $routeProvider
            .when('/admin', {
                title: 'Admin',
                templateUrl: 'modules/admin/admin.html',
                controller: 'AdminCtrl'
            });
    });