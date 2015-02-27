Template.post.helpers({
});

Template.post.events({
    "click .toggle-comments": function (event) {
        $(event.target).parent().siblings('.comments-wrapper').toggleClass('hidden');
    }
});

Template.post.rendered = function() {
    $('.toggle-comments').popup();
};