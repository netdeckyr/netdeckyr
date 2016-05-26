// jshint esversion: 6

const _ = require('lodash');

var base_controller = function(app) {
    const BaseController = function() {
        this.name = "base";
    };

    BaseController.extend = function(child) {
        child.prototype = _.create(BaseController.prototype, {
            'constructor': child
        });
        return child;
    };

    BaseController.prototype.bindContext = function(method) {
        return Function.prototype.bind.call(method, this);
    };

    return BaseController;
};

module.exports = base_controller;
