Template.player.helpers({
    'hasResourceSelected': function() {
        return Session.get('currentlyPlayingResource') == undefined;
    },
    'currentlyPlayingResource': function() {
        return Session.get('currentlyPlayingResource');
    }
});