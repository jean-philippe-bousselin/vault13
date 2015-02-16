angular.module('koan.common').directive('chat', function($timeout) {
    return {
        templateUrl: '/modules/chat/chat.html',
        link: function(scope, element) {
                scrollToBottom();
            function scrollToBottom() {
                $timeout(function(){
                    $('.chat-container').scrollTop($('.chat-container')[0].scrollHeight);
                    scrollToBottom();
                }, 300);
            }
        }
    };
});
