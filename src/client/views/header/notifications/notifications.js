Template.notifications.helpers({

    notifications: function() {
        return Meteor.user().notifications
    }

});

Template.notifications.rendered = function() {
    $('.notifications-button').dropdown();
};
