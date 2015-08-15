playlistItems = new Mongo.Collection('playlistItems');

playlistItems.attachSchema(
    new SimpleSchema({
        resource: {
            type: new SimpleSchema({
                "html" : {
                    type: String
                },
                "originalUrl" : {
                    type: String
                },
                "thumbnailUrl" : {
                    type: String
                },
                "title" : {
                    type: String
                },
                "author" : {
                    type: String
                },
                "tags": {
                    type: [new SimpleSchema({name: {type: String}})],
                    optional: true
                },
                publicId: {
                    type: String
                },
            })
        },
        "createdTime" : {
            type: Date
        },
        userId: {
            type: String
        }
    })
);

if (Meteor.isServer) {

    Meteor.publish('playlistItems', function () {
        return playlistItems.find({}, {sort: {createdTime: -1}});
    });

    playlistItems.allow({
        insert : function () {
            return true;
        },
        update : function () {
            return true;
        },
        remove : function () {
            return true;
        }
    });

    Meteor.methods({
        'playlist.addItem': function (resource) {

            if (! Meteor.userId()) {
                throw new Meteor.Error("not-authorized");
            }

            check(arguments, [Match.Any]);

            resource.publicId = new Date().getTime();

            playlistItems.insert({
                createdTime: new Date(),
                resource: resource,
                userId: Meteor.userId()
            });
        },

        'playlist.removeItem': function(resource) {
            if (!Meteor.userId()) {
                throw new Meteor.Error("not-authorized");
            }

            check(arguments, [Match.Any]);

            playlistItems.remove({
                userId: Meteor.userId(),
                "resource.publicId": resource.publicId
            })
        }

    });

}
