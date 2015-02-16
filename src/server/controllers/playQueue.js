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
    app.use(route.get('/api/playqueue', getQueue));
    app.use(route.post('/api/playqueue', queueItem));
};

/**
 * Lists last 15 posts with latest 15 comments in them.
 */
function *getQueue() {
    var items = yield mongo.playQueue.find(
            {user_id: this.user.id},
            {
                resourceId: 1,
                user_id: 1,
                html: 1
            }
        ).toArray();

    this.status = 201;
    this.body = items;
}

/**
 * Saves a new post in the database after proper validations.
 */
function *queueItem() {

    var data = yield parse(this);

    // delete item if already in queue
    yield mongo.playQueue.remove({
        user_id: this.user.id,
        resourceId: data.resourceId
    });

    var results = yield mongo.playQueue.insert({
        user_id: this.user.id,
        createdTime: new Date(),
        html: data.html,
        resourceId: data.resourceId
    });

    this.status = 201;
    this.body = {id: results[0]._id};
}
