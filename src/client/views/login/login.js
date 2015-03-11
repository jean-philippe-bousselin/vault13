Template.login.events({
    "submit #login-form": function(event, template) {
        event.preventDefault();
        Meteor.loginWithPassword(
            template.find("#login-username").value,
            template.find("#login-password").value,
            function(error) {
                if (error) {
                    // Display the login error to the user however you want
                }
            }
        );
    }
});