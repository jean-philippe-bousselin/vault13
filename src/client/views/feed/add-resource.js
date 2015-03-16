Template.addResource.events({
    'blur .artist-name': function() {
        debugger;
    }
});

Template.addResource.helpers({
    tagsLoaded: function() {
        return Session.get('newPost') !== undefined && Session.get('newPost').tagsLoaded;
    }
});

Template.addResource.rendered = function() {
    // initialize artist search
    $('.artist-search')
        .search({
            apiSettings: {
                url: 'http://ws.audioscrobbler.com/2.0/?method=artist.search&artist={query}&api_key=990d47d03475973d72e70c0e9123e00c&format=json'
            },
            type: 'lastFMArtists',
            searchFields   : [
                'name'
            ],
            onSelect: function(result, response){
                var newPost = Session.get('newPost');
                newPost.tagsLoaded = false;
                newPost.resource.author = this.text;
                Session.set('newPost', newPost);
                Meteor.apply('lastfm.artist.getTags', [newPost.resource.author], true, function(error, tags) {
                    var tagExists;
                    $.each(tags, function(index, newTag){
                        tagExists = false;
                        $.each(newPost.resource.tags, function(index, existingTag){
                            if(existingTag.name == newTag.name) {
                                tagExists = true;
                            }
                        });
                        if(!tagExists) {
                            newPost.resource.tags.push(newTag);
                        }
                    });

                    newPost.tagsLoaded = true;
                    Session.set('newPost', newPost);
                });
            },
            templates: {
                lastFMArtists: function(response) {
                    var html = '';
                    if(response.results !== undefined && response.results.artistmatches !== undefined) {
                        // each result
                        $.each(response.results.artistmatches.artist, function(index, result) {
                            html += '<a class="result">';
                            html += ''
                            + '<div class="image">'
                            + ' <img src="' + result.image[1]['#text'] + '">'
                            + '</div>'
                            html += '<div class="content">';
                            if(result.name !== undefined) {
                                html += '<div class="title">' + result.name + '</div>';
                            } else {
                                html += '<div class="title">Artist name not found.</div>';
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
                    if(response.results !== undefined && response.results.tagmatches !== undefined) {
                        // each result
                        $.each(response.results.tagmatches.tag, function(index, result) {
                            html += '<a class="result">';
                            html += '<div class="content">';
                            if(result.name !== undefined) {
                                html += '<div class="title">' + result.name + '</div>';
                            } else {
                                html += '<div class="title">Tag name not found.</div>';
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

