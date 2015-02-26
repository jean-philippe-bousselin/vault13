Template.basicLayout.created = function () {
    Session.set('isActive', false);
    Session.set('showLogin', false);
};

Template.basicLayout.helpers({
    isActive: function () {
        return Session.get('isActive') ? 'active' : '';
    },
    showLogin: function () {
        return Meteor.user();
    }
});

Template.basicLayout.events({

});
