Template.comments.events({
    "submit .new-comment": function (event) {
        Meteor.call("addComment", [event.target.text.value, this._id]);
        event.target.text.value = "";
        return false;
    }
});
