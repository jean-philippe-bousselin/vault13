Meteor.methods({

    "lastfm.artist.getTags": function (artist) {

        check(artist, String);

        if(artist != '') {

            var result = HTTP.get('http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&format=json', {
                params: {
                    artist: artist,
                    api_key: '990d47d03475973d72e70c0e9123e00c'
                }
            });
            if(result.data.hasOwnProperty('error') && result.data.error == 6) {
                // artist not found, silently return an empty array
                return [];
            }
            if(typeof result.data.artist.tags != 'object') {
                return [];
            }
            return result.data.artist.tags.tag;
        } else {
            return [];
        }
    }
});