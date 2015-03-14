Meteor.startup(function () {
    UploadServer.init({
        tmpDir: process.env.PWD + '/.uploads/tmp',
        uploadDir: process.env.PWD + '/.uploads/userpics',
        checkCreateDirectories: true
    });

    Houston.add_collection(Meteor.users);
    Houston.add_collection(Houston._admins);

    LastFMClient = new LastFM({
        apiKey    : '990d47d03475973d72e70c0e9123e00c',
        apiSecret : '598ad5662005daafaa3ff92795edbfeb'
    });
    //LastFM.setApiKey('990d47d03475973d72e70c0e9123e00c');
    //LastFM.setApiSecret('598ad5662005daafaa3ff92795edbfeb');
});