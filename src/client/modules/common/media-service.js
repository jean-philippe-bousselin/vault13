/**
 * Created by blackcat on 2/1/15.
 */
'use strict';

/**
 * Service for providing access the backend API via HTTP and WebSockets.
 */

angular.module('koan.common').factory('media', function ($rootScope, $http, $window, $q) {

    var token = ($window.sessionStorage.token || $window.localStorage.token),
        headers = {Authorization: 'Bearer ' + token},
        // TEMPORARY @TODO handle as must media as possible and drop this shit.
        iframeRegex = /<iframe.*<\/iframe>/i,
        youtubeRegex = /https?:\/\/(www\.)?youtu.*\/watch\?v=(.{11})/i,
        soundCloudRegex = /https?:\/\/soundcloud\.com\/\S*/gi,
        //bandCampRegex = /https?:\/\/(.*)\.bandcamp.com\/\S*/gi,
        urlRegex = /https?:\/\/\S*/i,
        media = {events: {}};

    media.platforms = {
        get: function (text) {
            var deferred = $q.defer();
            var regExp = youtubeRegex;
            var matchIframe = text.match(iframeRegex);
            var match = text.match(regExp);
            var matchSC = text.match(soundCloudRegex);
            //var matchBC = text.match(bandCampRegex);
            var matchUrl = text.match(urlRegex);

            if(matchIframe) {
                deferred.resolve({
                    text: text
                });
            } else if (match && match[2].length == 11) { // youtube
                $http({
                    method: 'GET',
                    url: 'https://gdata.youtube.com/feeds/api/videos/' + match[2] + '?v=2&alt=jsonc'
                })
                .success(function (videoInfosJson) {
                    // replace link with embeded player and return updated text
                    deferred.resolve({
                        text: text.replace(youtubeRegex, getYoutubeEmbededPlayer(match[2]))
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
                        text: text.replace(soundCloudRegex, responseJson.html)
                    });
                })
                .error(function () {
                    // do nothing
                    deferred.reject('error');
                });
            } else if(matchUrl){
                deferred.resolve({
                    text: text.replace(matchUrl, '<a href="' + matchUrl[0] + '" target="_blank">' + matchUrl[0] + '</a>')
                });
            } else {
                deferred.resolve({
                    text: text
                });
            }
            return deferred.promise;
        }
    };

    function getYoutubeEmbededPlayer(videoId){
        return '<iframe src="https://www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe>';
    }

    return media;
});