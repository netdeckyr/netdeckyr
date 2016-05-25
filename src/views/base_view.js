// jshint esversion: 6

const _ = require('lodash');

module.exports = function(app) {
    var BaseView = function(response, template) {
        this.response = response;
        this.template = template;
    };

    BaseView.prototype = {
    };

    return BaseView;
};
