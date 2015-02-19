Template.header.created = function () {
  Session.set('isActive', false);
  Session.set('showLogin', false);
};

Template['header'].helpers({
  isActive: function () {
    return Session.get('isActive') ? 'active' : '';
  }
});

Template['header'].events({
  'click .log-out.button' : function () {
    Meteor.logout();
  }
});

