// jshint esversion: 6

const use = require('rekuire');

var page_controller  = function(app) {
    const BaseController = use('base_controller')(app);

    const PageController = BaseController.extend(function() {
        BaseController.call(this);
        this.name = 'page';
    });

    PageController.prototype.index = function(request, response) {

    };

    PageController.prototype.home = function(request, response) {
        response.render();
    };

    return PageController;
};

module.exports = page_controller;
