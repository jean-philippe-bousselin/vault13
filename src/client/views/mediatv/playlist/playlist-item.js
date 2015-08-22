Template.playlistItem.helpers({
    onAir: function() {
        return JSON.stringify(Session.get('currentlyPlayingResource')) == JSON.stringify(this.resource)
    }
});

Template.playlistItem.events({

    'click .playlist-item': function(event, element) {
        Session.set('currentlyPlayingResource', this.resource);
    },
    'click .playlist-item button.remove-item': function(event, element) {
        Meteor.call("playlist.removeItem", this.resource);
        event.stopPropagation();
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
    // automatically scroll the playlist to bottom
    $('.playlist-items').animate({
        scrollTop: $('.playlist-items')[0].scrollHeight
    }, 500);
};