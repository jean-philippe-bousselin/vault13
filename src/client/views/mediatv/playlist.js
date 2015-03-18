Template.playlist.helpers({
    isPlaylistEmpty: function() {
        return Session.get('playlist').length == 0;
    },
    playlist: function() {
        return Session.get('playlist');
    }
});