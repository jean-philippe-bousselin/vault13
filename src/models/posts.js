posts = new Mongo.Collection('posts');

posts.attachSchema(
    new SimpleSchema({
        message: {
            type: String
        },
        resource: {
            type: new SimpleSchema({
                "token" : {
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
            type: Date
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
                    type: Date
                }
            })]
        }
    })
);

if (Meteor.isServer) {

    Meteor.publish('posts', function () {
        return posts.find();
    });

}
