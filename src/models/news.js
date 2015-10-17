news = new Mongo.Collection('news');

news.attachSchema(
    new SimpleSchema({
        title: {
            type: String
        },
        text: {
            type: String
        },
        createdTime : {
            type: Number,
            defaultValue: Date.parse(new Date())
        }
    })
);

if (Meteor.isServer) {

    Meteor.publish('news', function () {

        check(arguments, [Match.Any]);
        return news.find({}, {sort: {createdTime: -1}});

    });

    news.allow({
        insert: function () {
            return true;
        },
        update: function () {
            return false;
        },
        remove: function () {
            return false;
        }
    });
}
