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
    }
});

Template.addPost.rendered = function() {

    Session.setDefault('editingArtistName', false);
    Session.setDefault('editingResourceTitle', false);

    // initialize tag search
    $('.tag-search')
        .search({
            apiSettings: {
                url: '/lastfm/get-tags/{query}'
            },
            type: 'lastFMTags',
            onSelect: function(element) {
                var post = Session.get('newPost');
                var tagExists = false;
                var selectedTag = element;
                $.each(post.resource.tags, function(index, existingTag){
                    if(existingTag.name == selectedTag.name) {
                        tagExists = true;
                    }
                });
                if(!tagExists) {
                    post.resource.tags.push(selectedTag);
                }
                Session.set('newPost', post);
                $('.tag-search input').val('');
            },
            templates: {
                lastFMTags: function(response) {
                    var html = '';
                    if(response.results !== undefined) {
                        // each result
                        $.each(response.results, function(index, result) {
                            html += '<a class="result">';
                            html += '<div class="content">';
                            if(result.name !== undefined) {
                                html += '<div class="title">' + result.name + '</div>';
                            }
                            html += '</div>';
                            html += '</a>';
                        });
                        return html;
                    }
                    return false;
                }
            }
        })
    ;
};
