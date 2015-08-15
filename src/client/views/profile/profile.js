Meteor.subscribe("posts");
Meteor.subscribe("users");

var userPosts = [];

Template.profile.helpers({
    isOwnProfile: function() {
        return Meteor.user().username == this.user.username;
    },
    user: function () {
        return this.user;
    },
    userPosts: function() {

        return userPosts;
    },
    countPosts: function() {
        return userPosts.count();
    }

});

Template.profile.events({
    "click .edit-profile-button": function (event) {
        $('.profile-edit.ui.modal').modal(
            {
            onApprove: function() {
                var inputs = $('#user-infos-form :input');
                var values = {};
                inputs.each(function() {
                    values[this.name] = $(this).val();
                });
                Meteor.call('updateUserInfos', values);
            }
        }
        ).modal('show');
    }
});

Template.profile.created = function() {
    userPosts = posts.find({'from.name': this.data.user.username}, {sort: {createdTime: -1}});
};