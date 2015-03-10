if (Meteor.isServer) {

    Accounts.onCreateUser(function(options, user) {
        //pass the surname in the options

        user.profile['picture'] = options.picture;

        return user;
    });

    Meteor.methods({
        updatePicture: function (url) {
            // Make sure the user is logged in before inserting a task
            if (! Meteor.userId()) {
                throw new Meteor.Error("not-authorized");
            }
            Meteor.users.update({_id: Meteor.user()._id}, {$set:{"profile.picture": url}})
        }
    });
}