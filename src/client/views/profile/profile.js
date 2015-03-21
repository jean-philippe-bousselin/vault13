Meteor.subscribe("posts");
Meteor.subscribe("users");

Template.profile.helpers({
    isOwnProfile: function() {
        return Meteor.user().username == this.user.username;
    },
    user: function () {
        return this.user;
    },
    userPosts: function() {
        return posts.find({'from.name': this.user.userName}, {sort: {createdTime: -1}});
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