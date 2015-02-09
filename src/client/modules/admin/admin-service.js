'use strict';

/**
 * Service for providing access the backend API via HTTP and WebSockets.
 */

angular.module('koan.admin').factory('AdminService', function ($rootScope, $http, $window) {

    var apiBase = 'api' /* base /api uri */,
        token = ($window.sessionStorage.token || $window.localStorage.token),
        headers = {Authorization: 'Bearer ' + token},
        AdminService = {events: {}};

    // api http endpoints and websocket events
    AdminService.users = {
        create: function (post) {
            return $http({method: 'POST', url: apiBase + '/users', data: post, headers: headers});
        }
    };

    return AdminService;
});