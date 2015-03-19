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
                url: 'http://ws.audioscrobbler.com/2.0/?method=tag.search&tag={{query}}&api_key=990d47d03475973d72e70c0e9123e00c&format=json'
            },
            type: 'lastFMTags',
            searchFields   : [
                'name'
            ],
            onSelect: function(result, response) {
                var post = Session.get('newPost');
                post.resource.tags.push({name: this.text});
                Session.set('newPost', post);
                $('.tag-search input').val('');
            },
            templates: {
                lastFMTags: function(response) {
                    var html = '';
                    if(response.results !== undefined
                        && response.results.tagmatches !== undefined
                        && response.results.tagmatches.tag !== undefined
                        ) {
                        // each result
                        $.each(response.results.tagmatches.tag, function(index, result) {
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
