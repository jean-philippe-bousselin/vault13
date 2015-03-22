Template.feed.helpers({
    postCreationLoading: function() {
        return Session.get('postCreationLoading');
    },
    error: function() {
        return Session.get('createError');
    }
});

Template.feed.events({

    'submit #resource-add-form': function(event, template) {

        event.preventDefault();

        Session.set('postCreationLoading', true);

        var url = template.find('.add-url-button').value;

        Meteor.apply('iframely.oembed', [url], true, function(error, resource) {

            if(error) {
                Session.set('createError', {
                    message: 'The requested URL returned an error',
                    code: error.error
                });
                Session.set('postCreationLoading', false);
                $('.error.ui.modal').modal('show');
                return;
            }

            // @TODO this does not allow users to post regular content
            // even if it is culturally related.
            if(resource.html === undefined) {
                Session.set('createError', {
                    message: 'No resource found for the requested URL'
                });
                Session.set('postCreationLoading', false);
                $('.error.ui.modal').modal('show');
                return;
            }

            var newPost = {
                resource: resource,
                from: {
                    "id" : Meteor.userId(),
                    "name" : Meteor.user().username,
                    "picture" : Meteor.user().profile.picture
                },
                tagsLoaded: false
            };
            Session.set('newPost', newPost);

            Meteor.apply('lastfm.artist.getTags', [newPost.resource.author], true, function(error, tags) {
                newPost.resource.tags = tags;
                newPost.tagsLoaded = true;
                Session.set('newPost', newPost);
            });


            var modalContentView = Blaze.render(Template.addPost, document.getElementById('add-post-modal-content'));

            $('.add-resource.ui.modal').modal(
                {
                    onApprove: function() {
                        newPost = Session.get('newPost');
                        if(newPost.resource.author === '') {
                            newPost.resource.author = 'Unknown artist';
                        }
                        newPost.message = $('#user-expression-on-resource').val();
                        newPost.createdTime = Date.parse(new Date());
                        newPost.comments = [];
                        // add autoplay setting on iframe url.
                        var srcMatch = newPost.resource.html.match(/src="(.*)" frameborder/);
                        var separator;
                        if(srcMatch[0] !== undefined && srcMatch[0].match(/\?/) != null) {
                            separator = '&';
                        } else {
                            separator = '?'
                        }
                        newPost.resource.html = newPost.resource.html.replace(/src="(.*)" frameborder/, 'src="$1' + separator + 'autoplay=true&auto_play=true" frameborder');
                        posts.insert(newPost);
                    },
                    onHide: function() {
                        Session.set('postCreationLoading', false);
                        $('.resource-url-input-container').find('input').val('');
                    },
                    onHidden: function() {
                        Blaze.remove(modalContentView);
                    }
                }
            ).modal('show');

        });
    }
});

Template.feed.rendered = function() {

    $('#resource-add-form')
        .form({
            url: {
                identifier: 'url',
                rules: [
                    {
                        type: 'url',
                        prompt: 'Please enter a valid URL.'
                    }
                ]
            }
        }, {
            inline : true
        })
    ;

};