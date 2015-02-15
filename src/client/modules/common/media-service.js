'use strict';

angular.module('koan.common').factory('media', function ($rootScope, $http, $window, $q, youtubeService, soundcloudService) {

    var token = ($window.sessionStorage.token || $window.localStorage.token),
        headers = {Authorization: 'Bearer ' + token},
        // TEMPORARY @TODO handle as must media as possible and drop this shit.
        iframeRegex = /<iframe.*<\/iframe>/i,
        youtubeRegex = /https?:\/\/(www\.)?youtu.*\/(watch\?v=)?(.{11})/i,
        soundCloudRegex = /https?:\/\/soundcloud\.com\/\S*/gi,
        //bandCampRegex = /https?:\/\/(.*)\.bandcamp.com\/\S*/gi,
        urlRegex = /https?:\/\/\S*/i,
        media = {events: {}};

    media.processPost = function(post) {

        post.message = sanitize(post.message);

        var deferred = $q.defer(),
            servicePromises = [
            youtubeService.matchAndReplace(post),
            soundcloudService.matchAndReplace(post)
        ];

        $q.all(servicePromises)
        .then(function(data){
            deferred.resolve(post);
        }, function(errors){
            deferred.reject();
        });

        return deferred.promise;
    };

    function sanitize(string) {
        return string.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    };

    media.resource = {
        fetch: function(resourceId) {
            return $http({
                method: 'GET',
                url: 'api/resources/' + resourceId,
                headers: headers
            });
        }
    };

    media.platforms = {
        get: function (text) {
            var deferred = $q.defer();
            var matchIframe = text.match(iframeRegex);
            var matchYT = text.match(youtubeRegex);
            var matchSC = text.match(soundCloudRegex);
            //var matchBC = text.match(bandCampRegex);
            var matchUrl = text.match(urlRegex);

            if(matchIframe) {
                deferred.resolve({
                    text: text
                });
            } else if (matchYT && matchYT[3].length == 11) { // youtube
                $http({
                    method: 'GET',
                    url: 'https://gdata.youtube.com/feeds/api/videos/' + matchYT[3] + '?v=2&alt=jsonc'
                })
                .success(function (videoInfosJson) {
                    // replace link with embeded player and return updated text
                    deferred.resolve({
                        text: text
                                .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
                                .replace(youtubeRegex, getYoutubeEmbededPlayer(matchYT[3]))
                    });
                })
                .error(function () {
                    // do nothing
                    deferred.reject('error');
                });
            } else if(matchSC) { // soundcloud
                $http({
                    method: 'GET',
                    url: 'http://soundcloud.com/oembed?format=json&url=' + matchSC[0] + '&iframe=true'
                })
                .success(function (responseJson) {
                    deferred.resolve({
                        text: text
                                .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
                                .replace(soundCloudRegex, responseJson.html)
                    });
                })
                .error(function () {
                    // do nothing
                    deferred.reject('error');
                });
            } else if(matchUrl){
                deferred.resolve({
                    text: text
                            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
                            .replace(matchUrl, '<a href="' + matchUrl[0] + '" target="_blank">' + matchUrl[0] + '</a>')
                });
            } else {
                deferred.resolve({
                    text: text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
                });
            }
            return deferred.promise;
        }
    };

    return media;
});