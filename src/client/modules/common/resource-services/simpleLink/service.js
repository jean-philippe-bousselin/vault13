'use strict';

angular.module('koan.common').factory('simpleLinkService', function ($rootScope, $window, $http, $q) {

    var simpleLinkService = {},
        matchFullLink = /https?:\/\/.*\S/i;

    simpleLinkService.matchAndReplace = function(post) {
        var match = post.message.match(matchFullLink);
        if (match) {
            post.message = post.message.replace(matchFullLink, wrapStringIntoLink(match[0]));
        }
    };

    function wrapStringIntoLink(string) {
        return '<a href="' + string + '" target="_blank">' + string + '</a>';
    }

    return simpleLinkService;

});