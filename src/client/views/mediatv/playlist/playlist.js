Meteor.subscribe("playlistItems");

Template.playlist.helpers({
    isPlaylistEmpty: function() {
        return false;
    },
    playlist: function() {
        return playlistItems.find({userId: Meteor.userId()});
    }
});

Template.playlist.events({
    'click .clear-playlist': function() {
        Meteor.call("playlist.clear");
    },
    'click .stand-by-mode': function() {
        Session.set('currentlyPlayingResource', null);
    }
});

Template.playlist.rendered = function() {
  Session.setDefault('currentlyPlayingResource', null);
};