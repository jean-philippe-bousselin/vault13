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

            var lastfm = new LastFM({
                apiKey    : '990d47d03475973d72e70c0e9123e00c',
                apiSecret : '598ad5662005daafaa3ff92795edbfeb'
            });

            if(resource.author != '') {
                lastfm.artist.getInfo({artist: resource.author}, {success: function(data){
                    for(tag in data.artist.tags.tag) {
                        newPost.resource.tags.push(data.artist.tags.tag[tag]);
                    }
                    Session.set('newPost', newPost);
                }, error: function(code, message){
                    debugger;
                }});
            }


            //Meteor.call('lastfm.artist.getTags', resource.author, function(error, resource) {
            //    debugger;
            //});

            //LastFMApi.artist.getTags({artist: resource.author}, {success: function(data){
            //    debugger;
            //}, error: function(code, message){
            //    debugger;
            //}});



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