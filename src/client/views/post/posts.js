Meteor.subscribe("posts");

Template.posts.helpers({
    posts: function() {
        return posts.find({}, {sort: {createdTime: -1}}); 
    }
});