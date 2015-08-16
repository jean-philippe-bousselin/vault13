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

Router.route('/post/:id', {
    name: 'singlePost',
    controller: RouteController.extend({
        data: function() {
            var postArray = posts.find({_id: this.params.id}).fetch();
            return postArray.pop();
        },
        action: function () {
            this.render('singlePost');
        }
    })
});

Router.route('/search', function () {
    this.render('search');
});

Router.route('/search/:keyword', function () {
    this.render('search', {
        data: this.params.keyword
    });
});
Router.route('/about', {name: 'about'}, function () {
  this.render('about');
});

Router.route('/', {name: 'feed'}, function () {
  this.render('home');
});


/**
 * Last FM service
 */
Router.route('/lastfm/get-artist/:name', { where: 'server' })
    .get(function () {
        this.response.setHeader("Content-Type", "application/json");
        this.response.end(JSON.stringify({results: Meteor.call('lastfm.artist.find', this.params.name)}));
    });

Router.route('/lastfm/get-tags/:name', { where: 'server' })
    .get(function () {
        this.response.setHeader("Content-Type", "application/json");
        this.response.end(JSON.stringify({results: Meteor.call('lastfm.tags.find', this.params.name)}));
    });


Router.configure({
  onAfterAction: function() {
      if(Meteor.isClient) {
          $('.dynamic-content').hide().fadeIn(300);
      }
  }
});
