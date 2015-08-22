Template.posts.rendered = function() {
    Session.setDefault('postsAutorunRunning', false);
};

Template.posts.rendered = function () {

    Session.setDefault('postCreatedNotifications', 0);

    var initialized = false;
    this.data.posts.observeChanges({
        added: function (id, fields) {
            if(initialized) {
                Session.set('postCreatedNotifications', Session.get('postCreatedNotifications') + 1);
            }
        }
    });
    initialized = true;

};