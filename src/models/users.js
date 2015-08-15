if (Meteor.isServer) {

    Meteor.publish("users", function () {
        return Meteor.users.find({}, {
            fields: {
                'createdAt': 1,
                'username': 1,
                'profile.picture': 1
            }
        });
    });

    Accounts.onCreateUser(function(options, user) {
        //pass the surname in the options

        if(!user.hasOwnProperty('profile')) {
            user.profile = {};
        }
        user.profile.picture = '/images/avatar.png';

        return user;
    });

    Meteor.methods({

        'user.create': function (values) {

            check(arguments, [Match.Any]);

            if (values.username == '') {
                throw new Meteor.Error('Username is required.');
            }
            if (values.email == '') {
                throw new Meteor.Error('Email is required.');
            }
            var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
            if(!re.test(values.email)) {
                throw new Meteor.Error('Invalid email format.');
            }
            if (values.password == '') {
                throw new Meteor.Error('Password is required.');
            }
            if (values.passwordAgain == '') {
                throw new Meteor.Error('Password again is required.');
            }
            if (values.password != values.passwordAgain) {
                throw new Meteor.Error('Passwords does not match.');
            }

            var user = Meteor.users.findOne({username: values.username});
            if(typeof user != 'undefined') {
                throw new Meteor.Error('Username already exists.');
            }
            user = Meteor.users.findOne({email: values.email});
            if(typeof user != 'undefined') {
                throw new Meteor.Error('User with this email already exists.');
            }

            Accounts.createUser({
                username: values.username,
                email : values.email,
                password : values.password
            });
        },

        updateUserInfos: function (values) {

            if (! Meteor.userId()) {
                throw new Meteor.Error("not-authorized");
            }

            check(arguments, [Match.Any]);

            var data = {};
            data.username = values.username;
            if(values.profilePicture != '') {
                data.profile = {};
                data.profile.picture = values.profilePicture;
            }

            if(values.password != '' && values.passwordRepeat != '') {
                Accounts.setPassword(Meteor.userId(), values.password);
            }

            Meteor.users.update({_id: Meteor.user()._id}, {$set: data})
        }
    });
}