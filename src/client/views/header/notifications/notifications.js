Template.notifications.helpers({
    notifications: function() {
        return Meteor.user().notifications
    },
    hasNotifications: function() {
        if(Meteor.user().hasOwnProperty('notifications')) {
            return Meteor.user().notifications.length > 0;
        } else {
            return false;
        }
    }
});

Template.notifications.events({
    'click .notification-item': function(event){
        Meteor.call("user.deleteNotification", $(event.currentTarget).data('time'));
    },
    'click .mark-all-seen': function(event){
        Meteor.call("user.deleteAllNotifications");
    }
});

Template.notifications.rendered = function() {
    $('.notifications-button').dropdown();
};
