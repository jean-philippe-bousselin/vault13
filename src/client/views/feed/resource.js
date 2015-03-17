var playlistArray;

Template.resource.events({
    'click .add-to-playlist': function(event, element) {
        var selectedResource = this.resource;
        playlistArray = Session.get('playlist');
        // remove duplicates from the list if any (dupes are based on the url)
        $.each(playlistArray, function(key, resource){
            if(resource.originalUrl == selectedResource.originalUrl) {
                delete playlistArray[key];
            }
        });
        playlistArray.push(this.resource);
        // reset keys
        playlistArray = playlistArray.filter(function(){return true;});
        Session.set('playlist', playlistArray);
        // play resource if play button
        if(event.currentTarget.classList.contains('trigger-play')) {
            Session.set('currentlyPlayingResource', this.resource);
        }
    }
});