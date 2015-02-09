'use strict';

/**
 * Posts controller for serving user posts.
 */

var route = require('koa-route'),
    parse = require('co-body'),
    mongo = require('../config/mongo'),
    ws = require('../config/ws'),
    foreach = require('generator-foreach'),
    ObjectID = mongo.ObjectID;

// register koa routes
exports.init = function (app) {
  app.use(route.get('/api/posts', listPosts));
  app.use(route.post('/api/posts', createPost));
  app.use(route.post('/api/posts/:postId/comments', createComment));
};

/**
 * Lists last 15 posts with latest 15 comments in them.
 */
function *listPosts() {
  var author,
      posts = yield mongo.posts.find(
      {},
      {comments: {$slice: -15 /* only get last x many comments for each post */}},
      {limit: 15, sort: {_id: -1}} /* only get last 15 posts by last updated */).toArray();

    yield * foreach(posts, function * (post) {
        post.id = post._id;
        delete post._id;
        // attach the user to the post
        author = yield mongo.users.find(
            {_id: post.user_id}
        ).toArray();
        author = author[0];
        post.from = {
            id: author._id,
            name: author.name,
            picture: '/api/users/' + author._id + '/picture'
        };
    });

  this.body = posts;
}

/**
 * Saves a new post in the database after proper validations.
 */
function *createPost() {
  // it is best to validate post body with something like node-validator here, before saving it in the database..
  var post = yield parse(this);
  post.user_id = this.user.id;
  post.createdTime = new Date();
  var results = yield mongo.posts.insert(post);

  this.status = 201;
  this.body = {id: results[0]._id};

  // now notify everyone about this new post
  post.id = post._id;
  post.from = {
      id: this.user.id,
      name: this.user.name,
      picture: '/api/users/' + this.user.id + '/picture'
  };
  delete post._id;
  ws.notify('posts.created', post);
}

/**
 * Appends a new comment to a given post.
 * @param postId - Post ID.
 */
function *createComment(postId) {
  postId = new ObjectID(postId);
  var comment = yield parse(this);
  var commentId = new ObjectID();

  // update post document with the new comment
  comment = {_id: commentId, from: this.user, createdTime: new Date(), message: comment.message};
  var result = yield mongo.posts.update(
      {_id: postId},
      {$push: {comments: comment}}
  );

  this.status = 201;
  this.body = {id: commentId};

  // now notify everyone about this new comment
  comment.id = comment._id;
  comment.postId = postId;
  delete comment._id;
  ws.notify('posts.comments.created', comment);
}