/**
 * Created by blackcat on 2/1/15.
 */
'use strict';

/**
 * Service for providing access the backend API via HTTP and WebSockets.
 */

angular.module('koan.common').factory('media', function ($rootScope, $http, $window, $q, youtubeService) {

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

        var deferred = $q.defer(),
            servicePromises = [
            youtubeService.matchAndReplace(post)
        ];

        $q.all(servicePromises)
        .then(function(data){
            deferred.resolve(post);
        }, function(errors){
            deferred.reject();
        });

        //$.when(youtubePromise).done(function (ytResponse) {
        //    messageClosure = messageClosure.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
        //    youtubeService.
        //});

        return deferred.promise;
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

    function getYoutubeEmbededPlayer(videoId){
        return '<iframe src="https://www.youtube.com/embed/' + videoId + '" frameborder="0" allowfullscreen></iframe>';
    }

    return media;
});