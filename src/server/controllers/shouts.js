'use strict';

var route = require('koa-route'),
    parse = require('co-body'),
    mongo = require('../config/mongo'),
    ws = require('../config/ws'),
    foreach = require('generator-foreach'),
    ObjectID = mongo.ObjectID;

// register koa routes
exports.init = function (app) {
    app.use(route.get('/api/shouts', listShouts));
    app.use(route.post('/api/shouts', createShout));
};

/**
 * Lists last 15 posts with latest 15 comments in them.
 */
function *listShouts() {
    var shouts = yield mongo.shouts.find(
            {},
            {},
            {limit: 50, sort: {createdTime: 1}}).toArray();

    yield * foreach(shouts, function * (shout) {
        shout.id = shout._id;
        delete shout._id;
    });

    this.body = shouts;
}

/**
 * Saves a new post in the database after proper validations.
 */
function *createShout() {
    // it is best to validate post body with something like node-validator here, before saving it in the database..
    var shout = yield parse(this);
    shout.from = {
        id: this.user.id,
        name: this.user.name,
        picture: this.user.picture
    };
    shout.createdTime = new Date();
    var results = yield mongo.shouts.insert(shout);

    this.status = 201;
    this.body = {id: results[0]._id};

    // now notify everyone about this new post
    shout.id = shout._id;
    delete shout._id;
    ws.notify('shouts.created', shout);
}