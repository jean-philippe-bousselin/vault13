Template.scrollButtons.events({
    'click .go-top': function(){
        $('.dynamic-content').animate({
            scrollTop: 0
        }, 500);
    },
    'click .go-bottom': function(){
        $('.dynamic-content').animate({
            scrollTop: $('.dynamic-content')[0].scrollHeight
        }, 500);
    }
});

Template.scrollButtons.rendered = function() {
    var scrolltop;
    $('.dynamic-content').scroll(function(e){
        scrolltop = $(this).scrollTop();
        if(scrolltop > 50) {
            $('.omnibox-control-buttons').fadeIn('fast');
        } else {
            $('.omnibox-control-buttons').fadeOut('fast');
        }
        $('.omnibox-control-buttons').css('top', scrolltop);
    });
};