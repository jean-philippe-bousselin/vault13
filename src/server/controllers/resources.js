'use strict';

var qs = require('querystring'),
    route = require('koa-route'),
    parse = require('co-body'),
    mongo = require('../config/mongo'),
    ObjectID = mongo.ObjectID;

// register koa routes
exports.init = function (app) {
    app.use(route.post('/api/resources', createResource));
    app.use(route.get('/api/resources/:id', getResource));
};

function *getResource(id) {

    var resource = yield mongo.resources.findOne({resourceId: id});
    resource.id = resource._id;

    this.status = 201;
    this.body = resource;
}

function *createResource() {
    var resource = yield parse(this);
    resource.user_id = this.user.id;
    resource.createdTime = new Date();
    var results = yield mongo.resources.insert(resource);
    resource.id = results[0]._id;

    this.status = 201;
    this.body = resource;
}