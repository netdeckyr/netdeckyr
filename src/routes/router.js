// jshint esversion: 6

const _ = require('lodash');
const ExpressRouter = require('express').Router;

module.exports = function(app, express) {
    var Router = function(controller) {
        ExpressRouter.call(this);
        this.controller = controller;
    };

    Router.prototype = _.create(ExpressRouter(), {
        '_super': ExpressRouter(),
        'constructor': Router
    });

    Router.prototype.get = function(route, method) {
        this._super.get(route, method.bind(this.controller));
    }

    return Router;
};
