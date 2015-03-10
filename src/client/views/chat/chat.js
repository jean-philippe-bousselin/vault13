Meteor.subscribe("chats");

Template.chat.helpers({
    chats: function () {
        return chats.find({});
    }
});

Template.chat.events({
    "submit .new-chat": function (event) {
        Meteor.call("addChat", event.target.text.value);
        event.target.text.value = "";
        return false;
    }
});

Template.chat_row.rendered = function() {
    this.firstNode.parentNode.scrollTop = this.firstNode.parentNode.scrollHeight;
    $(this.firstNode).find('.image').popup({
        position: 'right center',
        onShow: function() {
            // reexec momentjs on the date
            this.find('.momentum').html(moment(this.find('.momentum').data('date-original')).fromNow());
        }
    });
};