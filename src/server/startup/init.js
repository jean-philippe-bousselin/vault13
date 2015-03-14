Meteor.startup(function () {
    UploadServer.init({
        tmpDir: process.env.PWD + '/.uploads/tmp',
        uploadDir: process.env.PWD + '/.uploads/userpics',
        checkCreateDirectories: true
    });

    Houston.add_collection(Meteor.users);
    Houston.add_collection(Houston._admins);

});