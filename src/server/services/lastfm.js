Meteor.methods({
    /**
     * Created by jean-philippe on 13.03.15.
     */
    "lastfm.artist.getTags": function (artist) {

        check(artist, String);


        LastFMApi = {
            client: new LastFM({
                apiKey    : '990d47d03475973d72e70c0e9123e00c',
                apiSecret : '598ad5662005daafaa3ff92795edbfeb'
            })
        };

        var tags = LastFMApi.client.artist.getTags(artist);

        console.log(tags);
    }
});