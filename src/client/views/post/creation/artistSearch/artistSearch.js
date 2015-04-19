Template.artistSearch.events({

    'click .input-save-artist-name': function(event, element) {
        refreshTags($('.artist-name.prompt').val());
    }

});

Template.artistSearch.rendered = function() {

    this.find('input[type=text]').focus();

    // initialize artist search
    $('.artist-search')
        .search({
            apiSettings: {
                url: '/lastfm/get-artist/{query}'
            },
            type: 'lastFMArtists',
            onSelect: function(element){
                refreshTags(element.name);
            },
            templates: {
                lastFMArtists: function(response) {
                    var html = '';
                    if(response.results !== undefined) {

                        // in case of single result, wrap it in an array
                        if(!$.isArray(response.results)) {
                            response.results = [response.results];
                        }

                        // each result
                        $.each(response.results, function(index, result) {
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

function refreshTags(artistName) {
    var newPost = Session.get('newPost');
    newPost.tagsLoaded = false;
    newPost.resource.author = artistName;
    Session.set('newPost', newPost);
    Session.set('editingArtistName', false);
    // Rebuild tags when changing artist name
    Meteor.apply('lastfm.artist.getTags', [newPost.resource.author], true, function(error, tags) {
        newPost.resource.tags = [];
        $.each(tags, function(index, newTag){
            newPost.resource.tags.push(newTag);
        });
        newPost.tagsLoaded = true;
        Session.set('newPost', newPost);
    });
}