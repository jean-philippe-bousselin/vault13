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

// Collection2 already does schema checking
// Add custom permission rules if needed
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
}
