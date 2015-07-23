Meteor.methods({
    "iframely.oembed": function (url) {

        check(url, String);

        var error;

        try {
            var result = HTTP.get('http://open.iframe.ly/api/oembed', {
                params: {
                    url: url,
                    origin: 'vault13'
                }
            });
        } catch (ex) {
            error = ex.response && ex.response.statusCode || ex.message;
        }

        error = (result && result.data && result.data.error) || (result && result.statusCode !== 200 && result.statusCode) || error;

        if (error) {
            throw new Meteor.Error(error);
        }

        return {
            type:         result.data.type,
            source:       result.data.provider_name,
            originalUrl:  result.data.url,
            thumbnailUrl: result.data.thumbnail_url,
            title:        result.data.title,
            author:       result.data.author || '',
            html:         result.data.html,
            tags:         []
        };
    }
});