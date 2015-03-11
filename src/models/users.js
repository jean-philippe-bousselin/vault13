if (Meteor.isServer) {

    Accounts.onCreateUser(function(options, user) {
        //pass the surname in the options

        if(!user.hasOwnProperty('profile')) {
            user.profile = {};
        }
        user.profile.picture = options.picture;

        return user;
    });



    Meteor.methods({
        updateUserInfos: function (values) {
            // Make sure the user is logged in before inserting a task
            if (! Meteor.userId()) {
                throw new Meteor.Error("not-authorized");
            }

            check(arguments, [Match.Any]);

            console.log(values);

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