Template.editProfileModal.helpers({
    uploadCallBacks: function() {
        return {
            finished: function(index, fileInfo, context) {
                $('#user-infos-form .profile-picture').val(fileInfo.url);
                $('.profile-pic-edit').attr('src', fileInfo.url);
            }
        }
    }
});