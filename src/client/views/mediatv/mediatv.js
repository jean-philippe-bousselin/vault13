Template.mediatv.helpers({
    'currentlyPlayingResource': function() {
        return Session.get('currentlyPlayingResource');
    }
});

Template.mediatv.events({

    'click .playlist-item': function(event, element) {
        Session.set('currentlyPlayingResource', this);
    }

});