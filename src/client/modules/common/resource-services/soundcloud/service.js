'use strict';

angular.module('koan.common').factory('soundcloudService', function ($rootScope, $window, $http, $q) {

    var soundcloudService = {},
        token = ($window.sessionStorage.token || $window.localStorage.token),
        headers = {Authorization: 'Bearer ' + token},
        matchRegex = /https?:\/\/soundcloud\.com\/\S*/i,
        apiUrl = 'http://soundcloud.com/oembed?format=json&url=%RESOURCEID%&iframe=true&auto_play=true',
        widget = null,
        playerId = 'soundcloud-player';

    soundcloudService.matchAndReplace = function(post) {

        var deferred = $q.defer(),
            matchSC = post.message.match(matchRegex);

        if (matchSC) {
            $http({
                method: 'GET',
                url: apiUrl.replace('%RESOURCEID%', matchSC[0])
            })
                .success(function (responseJson) {
                    // create the resource
                    createResource(responseJson)
                        .success(function (resource) {
                            //update the post message
                            post.message = post.message.replace(matchRegex, buildPreviewHtml(resource));
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

    soundcloudService.player = {
        initialize: function() {
           widget = SC.Widget(playerId);
        },
        getHTML: function(resource) {
            var iframe = $(resource.htmlPlayer);
            iframe.attr('id', playerId);
            iframe.removeAttr('width');
            iframe.removeAttr('height');
            return iframe[0];
        },
        trigger: function() {
            widget.toggle();
        },
        getInfos: function(resource) {
            return '<div>Selected: <b>' + resource.title + '</b></div>';
        }
    };

    function createResource(infosJson) {
        var resource = {
            type:        'soundcloud',
            resourceId:  'soundcloud_' + new Date().getTime(),
            title:        infosJson.title,
            htmlPlayer:   infosJson.html,
            author:       infosJson.author_name,
            thumbnailUrl: infosJson.thumbnail_url
        };
        return $http({method: 'POST', url: 'api/resources', data: resource, headers: headers});
    }

    function buildPreviewHtml(resource) {
        return '<div><img class="resource-thumbnail" ng-click="playResource(\'' + resource.resourceId + '\');" src="' + resource.thumbnailUrl + '" alt=""/><div><b>' + resource.title + '</b></div></div>';
    }

    return soundcloudService;

});