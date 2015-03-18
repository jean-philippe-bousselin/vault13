Template.resourceTitleEdit.helpers({

});

Template.resourceTitleEdit.events({

    'submit .title-edit-form': function(event, template) {
        var post = Session.get('newPost');
        post.resource.title = event.target[0].value;
        Session.set('newPost', post);
        Session.set('editingResourceTitle', false);

        event.preventDefault();
        return false;
    }

});

Template.resourceTitleEdit.rendered = function() {
    this.find('input[type=text]').focus();
};