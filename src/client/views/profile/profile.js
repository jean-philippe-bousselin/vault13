Template.profile.helpers({
    user: function () {
        return Meteor.user();
    },
    userPosts: function() {
        return posts.find({from:{id: Meteor.userId()}}, {sort: {createdTime: -1}});
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