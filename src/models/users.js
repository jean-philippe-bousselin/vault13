if (Meteor.isServer) {

    Meteor.publish("users", function () {
        return Meteor.users.find({}, {
            fields: {
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