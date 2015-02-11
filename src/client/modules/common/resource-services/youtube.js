/**
 * Created by blackcat on 2/1/15.
 */
'use strict';

/**
 * Service for providing access the backend API via HTTP and WebSockets.
 */

angular.module('koan.common').factory('youtubeService', function ($rootScope, $window, $http, $q) {

    var youtubeService = {},
        token = ($window.sessionStorage.token || $window.localStorage.token),
        headers = {Authorization: 'Bearer ' + token},
        matchRegex = /https?:\/\/(www\.)?youtu.*\/(watch\?v=)?(.{11})/i;

    youtubeService.matchAndReplace = function(post) {

        var deferred = $q.defer(),
            matchYT = post.message.match(matchRegex);

        if (matchYT && matchYT[3].length == 11) { // youtube
            $http({
                method: 'GET',
                url: 'https://gdata.youtube.com/feeds/api/videos/' + matchYT[3] + '?v=2&alt=jsonc'
            })
            .success(function (videoInfosJson) {

                // create the resource
                createResource(videoInfosJson)
                .success(function (resource) {
                    //update the post message
                        post.message = post.message.replace(matchRegex, buildHtml(resource));

                    deferred.resolve();
                })
                .error(function () {
                    // do nothing
                    deferred.reject('error');
                });
            })
            .error(function () {
                // do nothing
                deferred.reject('error');
            });
        }

        return deferred.promise;
    };

    function createResource(videoInfosJson) {
        var resource = {
            type:        'youtube',
            category:    videoInfosJson.data.category,
            resourceId:  videoInfosJson.data.id,
            title:       videoInfosJson.data.title,
            thumbnailLQUrl:   videoInfosJson.data.thumbnail.sqDefault,
            thumbnailHQUrl:   videoInfosJson.data.thumbnail.hqDefault
        };
        return $http({method: 'POST', url: 'api/resources', data: resource, headers: headers});
    }

    function buildHtml(resource) {
        return '<img src="' + resource.thumbnailHQUrl + '" data-resource-id="' + resource.resourceId + '" alt=""/><div><b>' + resource.title + '</b></div>';
    }

    return youtubeService;
});