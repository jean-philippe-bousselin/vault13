Template.profile.helpers({
    user: function () {
        return Meteor.user();
    }
});

Template.profile.events({
    "click .edit-profile-button": function (event) {
        $('.profile-edit.ui.modal').modal('show');
    }
});