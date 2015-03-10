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
                if(Session.get('newImageUrl')) {
                    Meteor.call('updatePicture', Session.get('newImageUrl'));
                }
            }
        }
        ).modal('show');
    }
});