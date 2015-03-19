Template.artistSearch.rendered = function() {

    this.find('input[type=text]').focus();

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
            onSelect: function(element, result, results){
                var newPost = Session.get('newPost');
                newPost.tagsLoaded = false;
                newPost.resource.author = this.text;
                Session.set('newPost', newPost);
                Session.set('editingArtistName', false);
                // Rebuild tags when changing artist name
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
                    if(response.results !== undefined
                        && response.results.artistmatches !== undefined
                        && response.results.artistmatches.artist !== undefined ) {

                        // in case of single result, wrap it in an array
                        if(!$.isArray(response.results.artistmatches.artist)) {
                            response.results.artistmatches.artist = [response.results.artistmatches.artist];
                        }

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
                    // append the query at the end of result
                    html += '<a class="result">';
                    html += '<div class="content">';
                    html += '<div class="title">' + response.results['@attr'].for + '</div>';
                    html += '</div>';
                    html += '</a>';
                    return html;
                }
            }
        })
    ;

};