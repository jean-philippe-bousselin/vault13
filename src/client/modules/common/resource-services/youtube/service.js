'use strict';

angular.module('koan.common').factory('youtubeService', function ($rootScope, $window, $http, $q) {

    var youtubeService = {},
        token = ($window.sessionStorage.token || $window.localStorage.token),
        headers = {Authorization: 'Bearer ' + token},
        matchRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?/i,
        apiUrl = 'https://gdata.youtube.com/feeds/api/videos/%VIDEOID%?v=2&alt=jsonc',
        playerId = 'youtube_embedded_player';

    youtubeService.matchAndReplace = function(post) {

        var deferred = $q.defer(),
            matchYT = post.message.match(matchRegex);

        if (matchYT && matchYT[1].length == 11) {
            $http({
                method: 'GET',
                url: apiUrl.replace('%VIDEOID%', matchYT[1])
            })
            .success(function (videoInfosJson) {

                // create the resource
                createResource(videoInfosJson)
                .success(function (resource) {
                    //update the post message
                    post.message = post.message.replace(matchRegex, buildPreviewHtml(resource));
                    deferred.resolve();
                })
                .error(function () {
                    // do nothing
                    deferred.resolve();
                });
            })
            .error(function () {
                // do nothing
                deferred.resolve();
            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    };

    youtubeService.player = {
        initialize: function() {},
        getHTML: function(resource) {
            // set the js player
            return '<iframe src="https://www.youtube.com/embed/' + resource.externalId + '?version=3&autoplay=1&enablejsapi=1&playerapiid=' + playerId + '" frameborder="0" allowfullscreen></iframe>';
        },
        trigger: function(action) {
            var iframe = document.getElementById("resource-player").getElementsByTagName("iframe")[0].contentWindow;
            iframe.postMessage('{"event":"command","func":"' + action + 'Video","args":""}', '*');
        },
        getInfos: function(resource) {
            return '<div>Selected: <b>' + resource.title + '</b></div>';
        },
        getQueueHTML: function(resource) {
            return '<div ng-click="playResource(\'' + resource.resourceId + '\');" class="media-left"><img src="' + resource.thumbnailLQUrl + '">' + resource.title; + '</div>';
        }
    };

    function createResource(videoInfosJson) {
        var resource = {
            type:        'youtube',
            category:    videoInfosJson.data.category,
            resourceId:  'youtube_' + videoInfosJson.data.id,
            externalId:  videoInfosJson.data.id,
            title:       videoInfosJson.data.title,
            thumbnailLQUrl:   videoInfosJson.data.thumbnail.sqDefault,
            thumbnailHQUrl:   videoInfosJson.data.thumbnail.hqDefault
        };
        return $http({method: 'POST', url: 'api/resources', data: resource, headers: headers});
    }

    function buildPreviewHtml(resource) {
        return '<div><img class="resource-thumbnail" ng-click="playResource(\'' + resource.resourceId + '\');" src="' + resource.thumbnailHQUrl + '" alt=""/><div><b>' + resource.title + '</b></div></div>';
    }

    return youtubeService;

});