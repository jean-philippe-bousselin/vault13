Template.feed.created = function() {
    Session.setDefault('limit', 10);
    Tracker.autorun(function() {
        Meteor.subscribe('posts', Session.get('limit'), function(){
            Tracker.afterFlush(function(){
                Session.set('postsAutorunRunning', false);
            });
        });
    });

};

Template.feed.helpers({
    loadingNewPosts: function() {
        return Session.get('postsAutorunRunning');
    }
});

Template.feed.events({
    'click button.more-content': function() {
        var newLimit = Session.get('limit') + 10;
        Session.set('postsAutorunRunning', true);
        Session.set('limit', newLimit);
    }
});