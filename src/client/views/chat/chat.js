Meteor.subscribe("chats");

Template['chat'].helpers({
    chats: function () {
        return chats.find({});
    }
});

Template.chat.rendered = function() {
    console.log('template rendered');
    // this.animate({ scrollTop: 1000}, "slow");
};
