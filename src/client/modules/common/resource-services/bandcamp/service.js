'use strict';

angular.module('koan.common').factory('bandcampService', function ($rootScope, $window, $http, $q) {

    var bandcampService = {},
        token = ($window.sessionStorage.token || $window.localStorage.token),
        headers = {Authorization: 'Bearer ' + token},
        matchRegex = /https?:\/\/.*\.bandcamp\.com\/\S*/i,
        apiUrl = 'http://api.embed.ly/1/oembed?url=%URL%&maxheight=350';

    bandcampService.matchAndReplace = function(post) {

        var deferred = $q.defer(),
            match = post.message.match(matchRegex);

        if (match) {
            $http({
                method: 'GET',
                url: apiUrl.replace('%URL%', match[0])
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

    bandcampService.player = {
        initialize: function() { },
        getHTML: function(resource) {
            return '<iframe id="bandcamp" style="border: 0;width: 100%" ' +
            'src="https://bandcamp.com/EmbeddedPlayer/album=633456388/size=large/bgcol=000000/linkcol=0687f5/artwork=small/transparent=true/auto_play=1" ' +
            'seamless>' +
            '</iframe>';

                //<iframe style="border: 0; width: 400px; height: 439px;" src="https://bandcamp.com/EmbeddedPlayer/album=633456388/size=large/bgcol=ffffff/linkcol=0687f5/artwork=small/transparent=true/" seamless><a href="http://chaosmoon.bandcamp.com/album/resurrection-extract">Resurrection Extract by Chaos Moon</a></iframe>


            //return resource.htmlPlayer;
        },
        trigger: function() {}
    };

    function createResource(infosJson) {
        var resource = {
            type:        'bandcamp',
            resourceId:  'bandcamp_' + new Date().getTime(),
            title:        infosJson.title,
            htmlPlayer:   infosJson.html,
            author:       infosJson.author_name,
            thumbnailUrl: infosJson.thumbnail_url,
            sharer:       $rootScope.common.user.name
        };
        return $http({method: 'POST', url: 'api/resources', data: resource, headers: headers});
    }

    return bandcampService;

});