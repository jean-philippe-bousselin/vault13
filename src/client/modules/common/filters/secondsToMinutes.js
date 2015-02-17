angular.module('koan.common').filter('secondsToMinutes', function() {
    return function(seconds) {
        var minutes = Math.floor(seconds / 60);
        var secs =  seconds % 60;
        minutes = (minutes < 10)? '0' + minutes : minutes;
        secs = (secs < 10)? '0' + secs : secs;
        return minutes + ':' + secs;
    }
});