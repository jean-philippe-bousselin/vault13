Template.post.helpers({
});

Template.post.events({
    "click .toggle-comments": function (event) {
        $(event.target).parent().siblings('.comments-wrapper').slideToggle('fast');
        event.preventDefault();
    }
});

Template.post.rendered = function() {
    $('.post .toggle-comments').popup();
    $('.post .tag').popup();
    //$('.post .ui.dropdown').dropdown();
};