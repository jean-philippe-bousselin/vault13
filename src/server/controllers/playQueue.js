'use strict';

/**
 * Posts controller for serving user posts.
 */

var qs = require('querystring'),
    route = require('koa-route'),
    parse = require('co-body'),
    mongo = require('../config/mongo');

// register koa routes
exports.init = function (app) {
    app.use(route.get('/api/playqueue/:userId', getQueue));
    app.use(route.post('/api/playqueue', queueItem));
};

/**
 * Lists last 15 posts with latest 15 comments in them.
 */
function *getQueue(userId) {
    console.log(userId);
    var items = yield mongo.playQueue.find(
            {},
            {html: 1}
        ).toArray();

    this.status = 201;
    this.body = items;
}

/**
 * Saves a new post in the database after proper validations.
 */
function *queueItem() {
    // it is best to validate post body with something like node-validator here, before saving it in the database..
    var data = yield parse(this);
    data.user_id = this.user.id;
    data.createdTime = new Date();
    var results = yield mongo.playQueue.insert(data);

    this.status = 201;
    this.body = {id: results[0]._id};
}
