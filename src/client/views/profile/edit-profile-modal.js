//Template.editProfileModal.events({
//    "onApprove .profile-edit": function (event) {
//        debugger;
//        if(Session.get('newImageUrl')) {
//            Meteor.call('updatePicture', Session.get('newImageUrl'));
//        }
//        return false;
//    }
//});

Template.editProfileModal.helpers({
    uploadCallBacks: function() {
        return {
            finished: function(index, fileInfo, context) {
                Session.set("newImageUrl", fileInfo.url);
                $('.profile-pic-edit').attr('src', fileInfo.url);
            }
        }
    }
});