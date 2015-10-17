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
                    type: [new SimpleSchema({name: {type: String}})],
                    optional: true
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

    Meteor.publish('posts', function (limit, user) {
        check(user, Match.Optional(String));
        check(limit, Number);

        if(typeof user != 'undefined') {
            return posts.find({'from.name': user}, {sort: {createdTime: -1}, limit: limit});
        } else {
            return posts.find({}, {sort: {createdTime: -1}, limit: limit});
        }
    });

    posts.allow({
        insert: function () {
            return true;
        },
        update: function () {
            return true;
        },
        remove: function () {
            return true;
        }
    });

    Meteor.methods({
        'posts.search': function(keyword) {
            check(keyword, String);
            var regex = new RegExp(keyword, 'i');
            return posts.find({
                $or: [
                    {"message": regex},
                    {"resource.author": regex},
                    {"resource.title": regex},
                    {"resource.tags": {$elemMatch: {name: regex}}}
                ]
            }).fetch();
        },
        addComment: function (args) {

            if (!Meteor.userId()) {
                throw new Meteor.Error("not-authorized");
            }

            check(arguments, [Match.Any]);

            // insert the actual comment
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
                    createdTime: Date.parse(new Date())
                }}
            });

            // notify users, determine the user ids first
            var post = posts.findOne({_id: args[1]});
            var ids = [];
            if(post.from.id != Meteor.userId()) {
                // post creator
                ids.push(post.from.id);
            }
            for(var i = 0; i < post.comments.length; i++) {
                if(post.comments[i].from.id != Meteor.userId()) {
                    ids.push(post.comments[i].from.id); // any commenter
                }
            }

            // add notification to users
            Meteor.users.update(
                {_id : { $in : ids}},
                {
                    $push: {
                        notifications: {
                            link: '/post/' + args[1],
                            message: '<b>' + Meteor.user().username + '</b> commented on <b>' + post.resource.title + '</b>',
                            createdTime: Date.parse(new Date())
                        }
                    }
                }
            );
        }
    });

}
