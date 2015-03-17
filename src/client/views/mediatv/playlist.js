Template.playlist.helpers({
    isPlaylistEmpty: function() {
        return Session.get('playlist').length == 0;
    },
    playlist: function() {
        return Session.get('playlist');
    }
});

Template.playlistItem.rendered = function() {
    $(this.firstNode).fadeIn('fast');
};