Template.header.created = function () {
  Session.set('isActive', false);
  Session.set('showLogin', false);
};

Template.header.helpers({
  active: function (route) {
    return Router.current().route.getName() == route;
  }
});

Template.header.events({
  'click .log-out.button' : function () {
    Meteor.logout();
  }
});
