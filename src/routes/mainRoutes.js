Router.configure({
    loadingTemplate:"loading"
});
Router.onBeforeAction("loading");

ProfileController = RouteController.extend({
    waitOn:function(){
        return Meteor.subscribe("posts", this.params.userName);
    },
    data: function() {
      return {
          user: Meteor.users.findOne({username: this.params.userName}),
          posts: posts.find({}, {sort: {createdTime: -1}})
      }
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

Router.route("feed",{
    path:"/",
    controller: RouteController.extend({
        template:"home",
        waitOn: function(){
            return Meteor.subscribe("posts");
        },
        data: function() {
            return {
                posts: posts.find({}, {sort: {createdTime: -1}})
            }
        },
    })
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
