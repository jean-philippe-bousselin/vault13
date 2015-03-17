var playlistArray;

Template.resource.events({
    'click .add-to-playlist': function(event, element) {
        playlistArray = Session.get('playlist');
        playlistArray.push(this.resource);
        Session.set('playlist', playlistArray);
        // play resource if play button
        if(event.currentTarget.classList.contains('trigger-play')) {
            Session.set('resourcePlayingHTML', this.resource.html);
        }
    }
});