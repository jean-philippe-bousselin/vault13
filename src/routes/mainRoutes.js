// Home Route
Router.route('/', {
    name: 'feed'
  }, function () {
  this.render('home');
});
Router.route('/profile', {name: 'profile'}, function () {
  this.render('profile');
});
Router.route('/about', {name: 'about'}, function () {
  this.render('about');
});

Router.configure({
  onAfterAction: function() {
    $('.dynamic-content').hide().fadeIn(300);
  }
});