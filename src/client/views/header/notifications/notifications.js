Template.notifications.helpers({

    notifications: function() {
        console.log(Meteor.user());
        return Meteor.user().notifications
    }

});

Template.notifications.rendered = function() {
    $('.notifications-button').dropdown();
};
