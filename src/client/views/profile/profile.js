Template.profile.helpers({
    user: function () {
        return Meteor.user();
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