Template.addPost.helpers({
    post: function() {
        return Session.get('newPost');
    },
    linkMode: function() {
        return Session.get('newPost') !== undefined && Session.get('newPost').resource.type == 'link';
    },
    tagsLoaded: function() {
        return Session.get('newPost') !== undefined && Session.get('newPost').tagsLoaded;
    },
    showWarningNoTags: function() {
        var post = Session.get('newPost');
        return post.resource.tags.length == 0 && post.resource.author != '';
    },
    showArtistEditField: function() {
        var show = false;

        if(!Session.get('newPost').resource.hasOwnProperty('author')) {
            show = true;
        }
        if(Session.get('newPost').resource.author === undefined) {
            show = true;
        }
        if(Session.get('editingArtistName')) {
            show = true;
        }

        return show;
    },
    showResourceTitleEditField: function() {
        return Session.get('editingResourceTitle');
    }
});

Template.addPost.events({
    'click .edit-artist-name': function() {
        Session.set('editingArtistName', true);
    },
    'click .edit-resource-title': function() {
        Session.set('editingResourceTitle', true);
    },
    'submit #add-tag-form': function(event, template) {
        var tagName = template.find('.tag-name').value;
        if(tagName == '') {
            return false;
        }
        var post = Session.get('newPost');
        post.resource.tags.push({
            name: tagName
        });
        Session.set('newPost', post);
        template.find('.tag-name').value = '';
        return false;
    }
});

Template.addPost.rendered = function() {
    Session.setDefault('editingArtistName', false);
    Session.setDefault('editingResourceTitle', false);
};
