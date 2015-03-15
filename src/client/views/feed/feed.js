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
        Meteor.call('iframely.oembed', url, function(error, resource) {

            if (error) {
                Session.set( url, {error: error.error});
                return;
            }

            var newPost = {
                resource: resource,
                from: {
                    "id" : Meteor.userId(),
                    "name" : Meteor.user().username,
                    "picture" : Meteor.user().profile.picture
                }
            };
            Session.set('newPost', newPost);

            // @TODO move this server side
            var lastfm = new LastFM({
                apiKey    : '990d47d03475973d72e70c0e9123e00c',
                apiSecret : '598ad5662005daafaa3ff92795edbfeb'
            });

            if(resource.author != '') {
                lastfm.artist.getInfo({artist: resource.author}, {
                    success: function(data){
                        for(tag in data.artist.tags.tag) {
                            newPost.resource.tags.push(data.artist.tags.tag[tag]);
                        }
                        Session.set('newPost', newPost);
                        $('.artist-tag').popup();
                    }
                });
            }

            $('.add-resource.ui.modal').modal(
                {
                    onVisible: function() {
                      //$('.artist-tag').popup();
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

        return;
    }

});