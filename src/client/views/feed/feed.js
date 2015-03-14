Template.feed.helpers({

    newPost: function() {
        return Session.get('newPost');
    }

});

Template.feed.events({

    'submit #resource-add-form': function(event, template) {

        event.preventDefault();

        //template.find('.add-url-button').addClass('loading');

        var url = template.find('.add-url-button').value;
        Meteor.call('iframely.oembed', url, function(error, resource) {

            if (error) {
                Session.set(key + url, {error: error.error});
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

            debugger;
            //Meteor.call('lastfm.artist.getTags', resource.author, function(error, tags) {
            //    debugger;
            //    newPost.resource.tags = tags;
            //});

            LastFMClient.artist.getTags({artist: resource.author}, {success: function(data){
                /* Use data. */
                debugger;
            }, error: function(code, message){
                debugger;
                /* Show error message. */
            }});

            Session.set('newPost', newPost);

            $('.add-resource.ui.modal').modal(
                {
                    onApprove: function() {

                    }
                }
            ).modal('show');

        });

        return;
    }

});