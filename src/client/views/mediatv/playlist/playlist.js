Meteor.subscribe("playlistItems");

Template.playlist.helpers({
    isPlaylistEmpty: function() {
        return false;
    },
    playlist: function() {
        return playlistItems.find({userId: Meteor.userId()});
    }
});

Template.playlist.rendered = function() {
  Session.setDefault('currentlyPlayingResource', null);
};