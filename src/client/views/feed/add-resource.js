Template.addResource.rendered = function() {

    $('.ui.search')
        .search({
            apiSettings: {
                url: 'http://ws.audioscrobbler.com/2.0/?method=artist.search&artist=cher&api_key=990d47d03475973d72e70c0e9123e00c&format=json'
            },
            type: 'category'
        })
    ;
};