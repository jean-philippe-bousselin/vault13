Template.login.helpers({

    'accessDenied': function() {
        return typeof Session.get('accessDenied') != 'undefined';
    }

});

Template.login.events({
    "submit #login-form": function(event, template) {
        event.preventDefault();
        var username = template.find("#login-username").value;
        var password = template.find("#login-password").value;

        if(username.length > 0 && password.length > 0) {
            Meteor.loginWithPassword(
                username,
                password,
                function(error) {
                    if (error) {
                        Session.set('accessDenied', true);
                    }
                }
            );
        }
    }
});