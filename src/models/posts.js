posts = new Mongo.Collection('posts');

posts.attachSchema(
    new SimpleSchema({
        message: {
            type: String,
            optional: true
        },
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
                    type: [new SimpleSchema({name: {type: String}})]
                }
            })
        },
        from: {
            type: new SimpleSchema({
                "id" : {
                    type: String
                },
                "name" : {
                    type: String
                },
                "picture" : {
                    type: String
                }
            })
        },
        createdTime : {
            type: Number
        },
        'comments': {
            type: [new SimpleSchema({
                message: {
                    type: String
                },
                from: {
                    type: new SimpleSchema({
                        "id" : {
                            type: String
                        },
                        "name" : {
                            type: String
                        },
                        "picture" : {
                            type: String
                        }
                    })
                },
                createdTime: {
                    type: Number
                }
            })]
        }
    })
);

if (Meteor.isServer) {

    Meteor.publish('posts', function () {
        return posts.find({}, {sort: {createdTime: -1}});
    });

    posts.allow({
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
        addComment: function (args) {
            // Make sure the user is logged in before inserting a task
            if (! Meteor.userId()) {
                throw new Meteor.Error("not-authorized");
            }

            check(arguments, [Match.Any]);

            posts.update({
                _id: args[1]
            }, {
                $push: {comments: {
                    message: args[0],
                    from: {
                        id: Meteor.userId(),
                        name: Meteor.user().username,
                        picture: Meteor.user().profile.picture
                    },
                    createdTime: new Date()
                }}
            });
        }
    });

}
