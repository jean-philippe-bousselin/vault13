Template.playlistItem.helpers({
    onAir: function() {
        return JSON.stringify(Session.get('currentlyPlayingResource')) == JSON.stringify(this.resource)
    }
});

Template.playlistItem.rendered = function() {
    $(this.firstNode).fadeIn('fast');
    $(this.firstNode).on('mouseover', function() {
        $(this).find('div.delete-button').removeClass('hidden');
    });
    $(this.firstNode).on('mouseleave', function() {
        $(this).find('div.delete-button').addClass('hidden');
    });
};