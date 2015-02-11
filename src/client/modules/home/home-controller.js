'use strict';

/**
 * Home controller simply lists all the posts from everyone on the front page.
 */

angular.module('koan.home').controller('HomeCtrl', function ($scope, api, media, $sce) {

  var postsPerRequest = 25;
  var loadedPostsCount = 0;
  var queryLocked = false;
  var user = $scope.common.user;
  $scope.postBox = {message: '', disabled: false};
  $scope.posts = [];
  $scope.noMorePosts = false; // disallow new post list request if true

  var datebuff;
  $scope.lastEnteredKey = null;
  $scope.lastEnteredKeyDate = null;

  $scope.loadPosts = function() {
    if(!$scope.noMorePosts && !queryLocked) {
      queryLocked = true;
      api.posts.list(postsPerRequest, loadedPostsCount).success(function (posts) {
        posts.forEach(function (post) {
          post.message = $sce.trustAsHtml(post.message);
          post.commentBox = {message: '', disabled: false};
          post.comments = post.comments || [];
        });
        $scope.posts = $scope.posts.concat(posts);
        loadedPostsCount += posts.length;
        queryLocked = false;
        if(posts.length < postsPerRequest) {
          // this means we loaded the last posts
          $scope.noMorePosts = true;
        }
      });
    }
  };

  // retrieve posts from server
  $scope.loadPosts();

  $scope.checkForSendShortcut = function($event) {
    datebuff = new Date();
    datebuff = datebuff.getTime();
    if($scope.lastEnteredKey != null
        && $event.keyCode === 13 // enter
        && $scope.lastEnteredKey == 16 // shift
        && (datebuff - $scope.lastEnteredKeyDate) < 500) {
      $scope.createPost($event);
      $event.preventDefault();
      return;
    }
    $scope.lastEnteredKeyDate = datebuff;
    $scope.lastEnteredKey = $event.keyCode;
  };

  // add post/comment creation functions to scope
  $scope.createPost = function ($event) {
    // don't let the user type in blank lines or submit empty/whitespace only post, or type in something when post is being created
    if (!$scope.postBox.message.length || $scope.postBox.disabled) {
      $event.preventDefault();
      return;
    }

    // disable the post box and push the new post to server
    $scope.postBox.disabled = true;

    media.platforms.get($scope.postBox.message)
      .then(function(response) {
        $scope.postBox.message = $sce.trustAsHtml(response.text);
        api.posts.create({message: response.text})
          .success(function (post) {
            // only add the post if we don't have it already in the posts list to avoid dupes
            if (!_.some($scope.posts, function (p) {
                  return p.id === post.id;
                })) {
              $scope.posts.unshift({
                id: post.id,
                from: user,
                message: $scope.postBox.message,
                createdTime: new Date(),
                comments: [],
                commentBox: {message: '', disabled: false}
              });
            }
            // clear the post box and enable it
            $scope.postBox.message = '';
            $scope.postBox.disabled = false;
          })
          .error(function () {
            // don't clear the post box but enable it so the user can re-try
            $scope.postBox.disabled = false;
          });
      });
  };

  $scope.createComment = function ($event, post) {
    // submit the message in the comment box only if user hits 'Enter (keycode 13)'
    if ($event.keyCode !== 13) {
      return;
    }

    // don't let the user type in blank lines or submit empty/whitespace only comment, or type in something when comment is being created
    if (!post.commentBox.message.length || post.commentBox.disabled) {
      $event.preventDefault();
      return;
    }

    // disable the comment box and push the new comment to server
    post.commentBox.disabled = true;
    api.posts.comments.create(post.id, {message: post.commentBox.message})
        .success(function (comment) {
          // only add the comment if we don't have it already in the post's comments list to avoid dupes
          if (!_.some(post.comments, function (c) {
            return c.id === comment.id;
          })) {
            post.comments.push({
              id: comment.id,
              from: user,
              message: post.commentBox.message,
              createdTime: new Date()
            });
          }

          // clear the comment field and enable it
          post.commentBox.message = '';
          post.commentBox.disabled = false;
        })
        .error(function () {
          // don't clear the comment box but enable it so the user can re-try
          post.commentBox.disabled = false;
        });

    // prevent default 'Enter' button behavior (create new line) as we want 'Enter' button to do submission
    $event.preventDefault();
  };

  // subscribe to websocket events to receive new posts, comments, etc.
  api.posts.created.subscribe($scope, function (post) {
    // only add the post if we don't have it already in the posts list to avoid dupes
    if (!_.some($scope.posts, function (p) {
      return p.id === post.id;
    })) {
      post.message = $sce.trustAsHtml(post.message);
      post.comments = [];
      post.commentBox = {message: '', disabled: false};
      $scope.posts.unshift(post);
    }
  });

  api.posts.comments.created.subscribe($scope, function (comment) {
    var post = _.find($scope.posts, function (post) {
      return post.id === comment.postId;
    });

    // only add the comment if we don't have it already in the post's comments list to avoid dupes
    if (post && !_.some(post.comments, function (c) {
      return c.id === comment.id;
    })) {
      post.comments.push(comment);
    }
  });

});