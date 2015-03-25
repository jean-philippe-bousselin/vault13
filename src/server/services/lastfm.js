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
    },

    "lastfm.tags.find": function (name) {
        check(name, String);
        var results = [];
        if(name != '') {
            var result = HTTP.get('http://ws.audioscrobbler.com/2.0/?method=tag.search&tag={{query}}&format=json', {
                params: {
                    tag: name,
                    api_key: '990d47d03475973d72e70c0e9123e00c'
                }
            });

            for(key in result.data.results.tagmatches.tag) {
                result.data.results.tagmatches.tag[key].title = result.data.results.tagmatches.tag[key].name;
                results.push(result.data.results.tagmatches.tag[key]);
            }
        }
        return results;
    }
});