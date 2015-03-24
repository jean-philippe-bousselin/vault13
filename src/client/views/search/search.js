Template.search.helpers({
    searchResults: function() {
        return Session.get('searchResults');
    },
    searchPending: function() {
        return Session.get('searchPending');
    },
    displayNoResults: function() {
        return Session.get('hasSearched') && Session.get('searchResults').length == 0;
    }
});

Template.search.events({

    'submit #search-form': function(event, template) {

        var keyword = template.find('.search-input').value;

        if(keyword.length == 0) {
            return false;
        }

        Session.set('searchPending', true);
        Session.set('hasSearched', true);

        Meteor.call('posts.search', keyword, function(error, results) {

            if(error !== undefined) {
                console.log(error);
            } else {
                Session.set('searchResults', results);
            }

            Session.set('searchPending', false);

        });

        event.preventDefault();
        return false;
    }

});

Template.search.created = function() {
    Session.setDefault('hasSearched', false);
    Session.setDefault('searchResults', []);
    Session.setDefault('searchPending', false);
};

Template.search.rendered = function() {
    $('.search-input').focus();
    // auto search if a keyword is passed in the url.
    if(this.data != null) {
        $('.search-input').val(this.data);
        $('#search-form').submit();
    }
};