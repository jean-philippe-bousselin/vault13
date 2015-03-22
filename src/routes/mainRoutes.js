//Router.route('/profile/:id', {name: 'profile'}, function () {
//  this.render('profile', {
//      data: function() {
//          return {userId: this.params.id};
//      }
//  });
//});

ProfileController = RouteController.extend({
    data: function() {
        return {
            user: Meteor.users.findOne({username: this.params.userName})
        };
    },

    action: function () {
        this.render('profile');
    }
});
Router.route('/profile/:userName', {
    name: 'profile',
    controller: ProfileController
});

Router.route('/about', {name: 'about'}, function () {
  this.render('about');
});
Router.route('/', {name: 'feed'}, function () {
  this.render('home');
});


Router.route('/lastfm/get-artist/:name', { where: 'server' })
    .get(function () {
        this.response.setHeader("Content-Type", "application/json");
        this.response.end(JSON.stringify({results: Meteor.call('lastfm.artist.find', this.params.name)}));

    });
//lastFMController = RouteController.extend({
//    action: function () {
//        Meteor.call('lastfm.artist.find', this.params.name, function(error, artists) {
//            debugger;
//        });
//    }
//});
//Router.route('/lastfm/get-artist/:name', {
//    controller: lastFMController
//});

Router.configure({
  onAfterAction: function() {
      if(Meteor.isClient) {
          $('.dynamic-content').hide().fadeIn(300);
      }
  }
});
