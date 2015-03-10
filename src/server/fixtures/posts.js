Fixtures = typeof Fixtures !== "undefined" ? Fixtures : {};

Fixtures.posts = [];

Fixtures.posts.push(
    {
        "message" : "Classique mais toujous bon. Je recommande chaudement pour les amateurs de trash.",
        "resource": {
            source: 'youtube',
            token: 'youtube_K6_zsJ8KPP0',
            originalUrl: 'https://www.youtube.com/watch?v=K6_zsJ8KPP0',
            thumbnailUrl: 'http://img.youtube.com/vi/K6_zsJ8KPP0/hqdefault.jpg',
            title: 'Angel of Death',
            author: 'Slayer',
            tags: [
                {
                    name: 'Metal'
                },
                {
                    name: 'Trash'
                },
                {
                    name: 'Hardcore'
                }]
        },
        "from" : {
            "id" : '1',
            "name" : "User",
            "picture" : "/images/avatar.png"
        },
        "createdTime" : new Date(),
        "comments": [
            {
                message: 'c\'est un tres bon groupe, neanmoins je reste sur justin bieber.',
                from: {
                    id: '1',
                    name: 'Dumb',
                    picture: '/images/avatar.png'
                },
                createdTime: new Date()
            },
            {
                message: 'je suis d\'accord, ca vaut pas un bon "baby baby babyyyyyyyyyyy ouuuuuuuuuhhhhhhh".',
                from: {
                    id: 2,
                    name: 'Dumber',
                    picture: '/images/avatar.png'
                },
                createdTime: new Date()
            }
        ]
    }
);
