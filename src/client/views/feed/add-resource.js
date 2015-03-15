
Template.addResource.rendered = function() {
    // initialize artist search
    $('.ui.search')
        .search({
            apiSettings: {
                url: 'http://ws.audioscrobbler.com/2.0/?method=artist.search&artist={query}&api_key=990d47d03475973d72e70c0e9123e00c&format=json'
            },
            type: 'lastFMArtists',
            searchFields   : [
                'name'
            ],
            templates: {
                lastFMArtists: function(response) {
                    var html = '';
                    if(response.results !== undefined) {
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
};

