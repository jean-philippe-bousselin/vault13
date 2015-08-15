Meteor.startup(function () {
    UploadServer.init({
        tmpDir: process.env.PWD + '/.uploads/tmp',
        uploadDir: process.env.PWD + '/.uploads/userpics',
        checkCreateDirectories: true
    });

    Houston.add_collection(Meteor.users);
    Houston.add_collection(Houston._admins);

    var smtp = {
        username: '',
        password: '',
        server:   '',
        port: 25
    };

    process.env.MAIL_URL = 'smtp://' + encodeURIComponent(smtp.username) + ':' + encodeURIComponent(smtp.password) + '@' + encodeURIComponent(smtp.server) + ':' + smtp.port;
});