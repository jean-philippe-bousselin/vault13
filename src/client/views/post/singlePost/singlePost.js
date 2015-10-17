Meteor.subscribe("posts", 10);

Template.singlePost.rendered = function() {
    $('.comments-wrapper.hidden').removeClass('hidden');
};
