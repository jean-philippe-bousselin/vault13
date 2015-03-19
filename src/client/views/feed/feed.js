var newPost;
function getTags() {
    Meteor.apply('lastfm.artist.getTags', [newPost.resource.author], true, function(error, tags) {
        newPost.resource.tags = tags;
        newPost.tagsLoaded = true;
        Session.set('newPost', newPost);
    });
}

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
            // it is only used to fix a supposed race condition
            // which is making meteor throw an arguments not checked exception
            Meteor.setTimeout(
                getTags,
            1000);

            var modalContentView;
            $('.add-resource.ui.modal').modal(
                {
                    onShow: function() {
                        modalContentView = Blaze.render(Template.addPost, document.getElementById('add-post-modal-content'));
                    },
                    onApprove: function() {
                        newPost = Session.get('newPost');
                        newPost.message = $('#user-expression-on-resource').val();
                        newPost.createdTime = Date.parse(new Date());
                        newPost.comments = [];
                        posts.insert(newPost);
                    },
                    onHide: function() {
                        Session.set('postCreationLoading', false);
                        $('.resource-url-input-container').find('input').val('');
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