function loadFixture(fixtures, collection) {
  for (var i = 0; i < fixtures.length; i+= 1) {
    collection.insert(fixtures[i]);
  }
}

function clearDb() {
    chats.remove({});
    posts.remove({});
    //Meteor.users.remove({});
}

Meteor.startup(function () {
  //clearDb();
  //loadFixture(Fixtures.chats, chats);
  //loadFixture(Fixtures.posts, posts);
});