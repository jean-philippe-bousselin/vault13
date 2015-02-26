// Home Route
Router.route('/', {
    name: 'feed'
  }, function () {
  this.render('home');
  SEO.set({ title: 'Home - ' + Meteor.App.NAME });
});
Router.route('/profile', {name: 'profile'}, function () {
  this.render('profile');
  SEO.set({ title: 'Profile - ' + Meteor.App.NAME });
});

Router.configure({
  onAfterAction: function() {
    $('.dynamic-content').hide().fadeIn(300);
  }
});