Template.edit_profile_modal.helpers({
    uploadCallBacks: function() {
        return {
            finished: function(index, fileInfo, context) {
                $('.profile-pic-edit').attr('src', fileInfo.url);
            }
        }
    }
});