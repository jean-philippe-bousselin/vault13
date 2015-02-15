angular.module('koan.common').directive("scrollWatcher", function () {
    return function(scope, element, attrs) {
        angular.element(element).bind("scroll", function(e) {
            // if the scroll state is above 95% we need to load more posts
            if(((e.currentTarget.clientHeight + e.currentTarget.scrollTop) * 100) / e.currentTarget.scrollHeight > 99) {
                scope.loadPosts();
            }
        });
    };
});