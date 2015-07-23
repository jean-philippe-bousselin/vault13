var playlistArray;

Template.resource.events({
    'click .add-to-playlist': function(event, element) {
        var selectedResource = this.resource;

        Meteor.call("addPlaylistItem", this.resource);

        // play resource if play button
        if(event.currentTarget.classList.contains('trigger-play')) {
            Session.set('currentlyPlayingResource', this.resource);
        }
    }
});