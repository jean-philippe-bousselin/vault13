chats = new Mongo.Collection('chats');

chats.attachSchema(
    new SimpleSchema({
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
        "createdTime" : {
            type: Date
        }
    })
);

if (Meteor.isServer) {

    Meteor.publish('chats', function () {
        return chats.find();
    });

    chats.allow({
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
        addChat: function (text) {
            // Make sure the user is logged in before inserting a task
            if (! Meteor.userId()) {
                throw new Meteor.Error("not-authorized");
            }
            chats.insert({
                message: text,
                createdTime: new Date(),
                from: {
                    id: Meteor.userId(),
                    name: Meteor.user().username,
                    picture: "/public/images/avatar.png"
                }
            });
        }
    });
}
