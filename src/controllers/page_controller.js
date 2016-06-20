// jshint esversion: 6

/**
 * @module page_controller
 * @description Provides the {@link module:page_controller~PageController} class.
 *
 * @param  {Object} app The express application.
 * @return {function}     The PageController constructor.
 *
 * @requires rekuire
 * @requires {@link module:base_controller~BaseController}
 */
var page_controller  = function(app) {

    const use = require('rekuire');
    const BaseController = use('base_controller')(app);

    const PageController = BaseController.extend(function() {
        BaseController.call(this);
        this.name = 'page';
    });

    PageController.prototype.index = function(request, response) {

    };

    PageController.prototype.home = function(request, response) {

    };

    return PageController;
};

module.exports = page_controller;
