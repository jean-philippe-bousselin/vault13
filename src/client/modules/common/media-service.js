'use strict';

/**
 * General service for embedded media management.
 */
angular.module('koan.common').factory('media', function ($rootScope, $http, $window, $q, youtubeService, soundcloudService, vimeoService) {

    var token = ($window.sessionStorage.token || $window.localStorage.token),
        headers = {Authorization: 'Bearer ' + token},
        media = {};

    /**
     * Check a post message content for any external services url.
     * Executes a number of services on the messages, and replaces
     * the content as necessary.
     *
     * @param post
     * @returns Promise
     */
    media.processPost = function(post) {

        post.message = sanitize(post.message);

        var deferred = $q.defer(),
            servicePromises = [
            youtubeService.matchAndReplace(post),
            soundcloudService.matchAndReplace(post),
            vimeoService.matchAndReplace(post)
        ];

        $q.all(servicePromises)
        .then(function(data){
            deferred.resolve(post);
        }, function(errors){
            deferred.reject();
        });

        return deferred.promise;
    };

    /**
     * Escapes html elements from a string.
     *
     * @param string
     * @returns {string}
     */
    function sanitize(string) {
        return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };

    /**
     * Defines a serie of functions suitable
     * for a resource.
     */
    media.resource = {
        fetch: function(resourceId) {
            return $http({
                method: 'GET',
                url: 'api/resources/' + resourceId,
                headers: headers
            });
        },
        addResourceToQueue: function(resource) {
            return $http({
                method: 'POST',
                url: 'api/playQueue/',
                data: {
                    resource: resource
                },
                headers: headers
            });
        },
        loadQueue: function() {
            return $http({
                method: 'GET',
                url: 'api/playQueue',
                headers: headers
            });
        }
    };

    return media;
});