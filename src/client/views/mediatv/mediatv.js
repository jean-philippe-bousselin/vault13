Template.mediatv.events({

    'click .playlist-item': function(event, element) {
        Session.set('currentlyPlayingResource', this);
    }

});