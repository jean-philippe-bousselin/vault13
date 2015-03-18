var selectedTag, newPost;
Template.tag.events({
    'click .artist-tag': function() {
        // delete the tag on click over it
        newPost = Session.get('newPost');
        selectedTag = this;
        $.each(newPost.resource.tags, function(index, tag){
            if(tag.name == selectedTag.name) {
                delete newPost.resource.tags[index];
                // reset keys
                newPost.resource.tags = newPost.resource.tags.filter(function(){return true;});
                Session.set('newPost', newPost);
            }
        });

    }
});