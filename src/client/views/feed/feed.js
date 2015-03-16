var newPost;
function getTags() {
    Meteor.apply('lastfm.artist.getTags', [newPost.resource.author], true, function(error, tags) {
        newPost.resource.tags = tags;
        newPost.tagsLoaded = true;
        Session.set('newPost', newPost);
    });
};

Template.feed.helpers({

    newPost: function() {
        return Session.get('newPost');
    }
});

Template.feed.events({

    'submit #resource-add-form': function(event, template) {

        event.preventDefault();

        $('.resource-url-input-container').addClass('loading');

        var url = template.find('.add-url-button').value;
        Meteor.apply('iframely.oembed', [url], true, function(error, resource) {
            newPost = {
                resource: resource,
                from: {
                    "id" : Meteor.userId(),
                    "name" : Meteor.user().username,
                    "picture" : Meteor.user().profile.picture
                },
                tagsLoaded: false
            };
            Session.set('newPost', newPost);

            //@TODO find a way to remove this ugly setimeout
            // it is only used to fix a supposed race conditions
            // which is making meteor throw an arguments not checked exception
            Meteor.setTimeout(
                getTags,
            1000);

            $('.add-resource.ui.modal').modal(
                {
                    onVisible: function() {
                        $('.artist-tag').click(function(){
                          var value = $(this).html().trim();
                          for (index in newPost.resource.tags) {
                              if(value == newPost.resource.tags[index]) {
                                  delete newPost.resource.tags[index];
                              }
                          }
                          Session.set('newPost', newPost);
                        });
                    },
                    onApprove: function() {
                        newPost = Session.get('newPost');
                        newPost.message = $('#user-expression-on-resource').val();
                        newPost.createdTime = Date.parse(new Date());
                        newPost.comments = [];
                        posts.insert(newPost);
                    },
                    onHide: function() {
                        $('.resource-url-input-container').removeClass('loading');
                        $('.resource-url-input-container').find('input').val('');
                    }
                }
            ).modal('show');

        });

    }

});