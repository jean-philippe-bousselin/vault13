var playlistArray;

Template.resource.events({
    'click .add-to-playlist': function() {
        playlistArray = Session.get('playlist');
        playlistArray.push(this.resource);
        Session.set('playlist', playlistArray);
    }
});