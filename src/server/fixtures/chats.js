Fixtures = typeof Fixtures !== "undefined" ? Fixtures : {};

Fixtures.chats = [];

for(var i = 0; i < 99; i++) {
    Fixtures.chats.push(
        {
            "message" : "Chat message number " + i,
            "from" : {
                "id" : "1",
                "name" : "User",
                "picture" : "/public/images/avatar.png"
            },
            "createdTime" : new Date()
        }
    );
}

