Template.playlistItem.helpers({
    onAir: function() {
        return JSON.stringify(Session.get('currentlyPlayingResource')) == JSON.stringify(this)
    }
});

Template.playlistItem.rendered = function() {
    $(this.firstNode).fadeIn('fast');
};