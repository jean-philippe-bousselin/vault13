Template.post.helpers({
    totalComments: function () {
        return this.comments.length;
    }
});

Template.post.events({
    "click .toggle-comments": function (event) {
        $(event.target).parent().siblings('.comments-wrapper').slideToggle('fast');
        event.preventDefault();
    },
    'click .open-post': function(event, template) {
        Router.go(
            Router.path('singlePost', {id: this._id})
        );
    }
});

Template.post.rendered = function() {

    if(this.data.comments.length > 0) {
        $(this.firstNode).find('.comments-wrapper').addClass('hidden');
    }

    $('.post .toggle-comments').popup();
    $('.post .tag').popup();
    $('.post .tag').click(function() {
        $(this).popup('destroy');
    });
    $(this.firstNode).find('.special.cards .image').dimmer({
        on: 'hover'
    });
};