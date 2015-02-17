'use strict';

angular.module('koan.common').factory('vimeoService', function ($rootScope, $window, $http, $q) {

    var vimeoService = {},
        token = ($window.sessionStorage.token || $window.localStorage.token),
        headers = {Authorization: 'Bearer ' + token},
        matchRegex = /https?:\/\/vimeo\.com\/\S*/i,
        apiUrl = 'https://vimeo.com/api/oembed.json?url=%RESOURCEID%&autoplay=1',
        widget = null,
        playerId = 'vimeo-player';

    vimeoService.matchAndReplace = function(post) {
        var deferred = $q.defer(),
            match = post.message.match(matchRegex);

        if (match) {
            $http({
                method: 'GET',
                url: apiUrl.replace('%RESOURCEID%', match[0])
            })
            .success(function (responseJson) {
                // create the resource
                createResource(responseJson)
                    .success(function (resource) {
                        //update the post message
                        post.message = post.message.replace(matchRegex, '');
                        // add the resource to post
                        post.resources.push(resource);
                        deferred.resolve();
                    })
                    .error(function () {
                        deferred.resolve();
                    });
            })
            .error(function () {
                deferred.resolve();
            });
        } else {
            deferred.resolve();
        }

        return deferred.promise;
    };

    vimeoService.player = {
        initialize: function() {},
        getHTML: function(resource) {
            return resource.htmlPlayer;
        },
        trigger: function() {
        }
    };

    function createResource(infosJson) {
        debugger;
        var resource = {
            type:        'vimeo',
            resourceId:  'vimeo_' + infosJson.video_id,
            externalId:   infosJson.video_id,
            title:        infosJson.title,
            htmlPlayer:   infosJson.html,
            author:       infosJson.author_name,
            thumbnailUrl: infosJson.thumbnail_url,
        };
        return $http({method: 'POST', url: 'api/resources', data: resource, headers: headers});
    }

    return vimeoService;

});