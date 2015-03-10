Meteor.subscribe("posts");

Template.posts.helpers({
    posts: function () {
        return posts.find({});
    }
});
