Meteor.methods({

    "lastfm.artist.getTags": function (artist) {

        check(artist, String);
        if(artist != '') {
            try {
                var result = HTTP.get('http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&format=json', {
                    params: {
                        artist: artist,
                        api_key: '990d47d03475973d72e70c0e9123e00c'
                    }
                });
            } catch (e) {
                return [];
            }

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
    },

    "lastfm.artist.find": function (artist) {

        check(artist, String);
        var results = [];
        if(artist != '') {
            var result = HTTP.get('http://ws.audioscrobbler.com/2.0/?method=artist.search&format=json', {
                params: {
                    artist: artist,
                    api_key: '990d47d03475973d72e70c0e9123e00c'
                }
            });
            for(key in result.data.results.artistmatches.artist) {
                result.data.results.artistmatches.artist[key].title = result.data.results.artistmatches.artist[key].name;
                results.push(result.data.results.artistmatches.artist[key]);
            }
        }
        return results;
    }
});