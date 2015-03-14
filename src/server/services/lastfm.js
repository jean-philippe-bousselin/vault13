Meteor.methods({
    /**
     * Created by jean-philippe on 13.03.15.
     */
    "lastfm.artist.getTags": function (artist) {

        check(artist, String);

        var error;
        console.log(artist);
        try {
            var result = HTTP.get('http://ws.audioscrobbler.com/2.0/', {
                params: {
                    method: 'artist.getTags',
                    artist: artist,
                    api_key: '990d47d03475973d72e70c0e9123e00c',
                    format: 'json',
                    secret: '598ad5662005daafaa3ff92795edbfeb'
                }
            });
            //var result = LastFM.request('album.getinfo', opts, this.userId);
        } catch (ex) {
            error = ex.response && ex.response.statusCode || ex.message;
        }

        console.log(result);
        error = (result && result.content && result.content.message) || (result && result.statusCode !== 200 && result.statusCode) || error;


        if (error) {
            throw new Meteor.Error(error);
        }

        return result;
    }
});