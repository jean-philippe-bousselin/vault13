Template.mediatv.helpers({

    'player': function() {
        return Session.get('resourcePlayingHTML');
    }

});

Template.mediatv.events({

    'click .playlist-item': function(event, element) {
        Session.set('resourcePlayingHTML', this.html);
    }

});