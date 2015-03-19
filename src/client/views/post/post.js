Template.post.helpers({
    totalComments: function () {
        return this.comments.length;
    }
});

Template.post.events({
    "click .toggle-comments": function (event) {
        $(event.target).parent().siblings('.comments-wrapper').slideToggle('fast');
        event.preventDefault();
    }
});

Template.post.rendered = function() {

    if(this.data.comments.length > 0) {
        $(this.firstNode).find('.comments-wrapper').addClass('hidden');
    }

    $('.post .toggle-comments').popup();
    $('.post .tag').popup();
    $(this.firstNode).find('.special.cards .image').dimmer({
        on: 'hover'
    });
};