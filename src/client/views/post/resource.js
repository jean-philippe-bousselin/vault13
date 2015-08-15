Template.resource.events({
    'click .add-to-playlist': function(event, element) {
        Meteor.call("playlist.addItem", this.resource);
        // play resource if play button
        if(event.currentTarget.classList.contains('trigger-play')) {
            Session.set('currentlyPlayingResource', this.resource);
        }
    }
});