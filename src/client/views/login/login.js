Template.login.helpers({

    'accessDenied': function() {
        return typeof Session.get('accessDenied') != 'undefined';
    },
    'hasRegistrationError': function() {
        return typeof Session.get('registrationError') != 'undefined';
    },
    'registrationError': function() {
        return Session.get('registrationError');
    }

});

Template.login.events({

    'click a#at-register': function(event, template) {
        template.find(".at-form.login").style.display = 'none';
        template.find(".at-form.register").style.display = 'block';
    },
    'click a#at-login': function(event, template) {
        template.find(".at-form.register").style.display = 'none';
        template.find(".at-form.login").style.display = 'block';
    },

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
    },

    'submit #register-form': function(event, template){
        event.preventDefault();
        var username = template.find("#register-username").value;
        var password = template.find("#register-password").value;
        var passwordAgain = template.find("#register-password-again").value;
        var email = template.find("#register-email").value;

        var values = {
            username: username,
            password: password,
            passwordAgain: passwordAgain,
            email: email
        };

        Meteor.call('user.create', values, function (error, result) {
            if (error) {
                Session.set('registrationError', error.error);
            } else {
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
        });
    }
});