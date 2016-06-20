// jshint esversion: 6

/**
 * @module      base_controller
 * @description Provides the {@link module:base_controller~BaseController}
 *  class. Uses dependency injection to access the express application.
 *
 * @param       {Object}    app The express application.
 *
 * @requires    lodash
 * @requires    methods
 * @requires    extensive
 */
var base_controller = function(app) {

    const _           = require('lodash');
    const httpMethods = require('methods');
    const extend      = require('extensive');

    /**
     * @class       BaseController
     * @classdesc   The base controller. Provides the basic functionality of a
     *  controller, including router bindings and basic inheritance.
     * @description The BaseController constructor returns a new BaseController
     *  instance.
     */
    const BaseController = extend(function() {}, {

        /**
         * @method initialize
         *
         * @desc Sets up the router with the passed in http verb bindings and
         *  parameter middleware functions.
         *
         * @param {Object}                      router   an express.js router
         * @param {Object<string, function>}    bindings a collection of http verbs
         *  and route functions to run for each.
         * @param {Object<string, function>}    params   a collection of parameter
         *  names and parameter middleware functions to attach to the router.
         */
        initialize: function(router, bindings, params) {
            setupBindings(this, router, bindings);
            setupParams(this, router, params);
        },

        instanceMethods: function() {
            return _.functionsIn(this);
        },

        bindContext: function(method) {
            return method.bind(this);
        }
    }, {
        classMethods: function() {
            return _.functions(this);
        }
    });

    const setupBindings = function(context, router, bindings) {
        // Set up route bindings:
        //   [1] If the binding is a function, bind it to all HTTP verbs on the route.
        //   [2] If the binding is an object, bind each method to the corresponding HTTP verb.
        _.forOwn(bindings, function(binding, route) {
            if (typeof binding === 'function') {
                // [1]
                router.all(route, context.bindContext(binding));
            } else {
                // [2]
                bindVerbs(context, router, route, binding);
            }
        });
    };

    const bindVerbs = function(context, router, route, binding) {
        // TODO: Find out why all verbs are added for the specified route and binding.
        //       see: test_base_controller l:112 failing test.
        _.forOwn(binding, function(method, verb) {
            // Only bind valid HTTP verbs.
            if (_.includes(httpMethods, verb)) {
                router[verb](route, context.bindContext(method));
            }
        });
    };

    const setupParams = function(context, router, params) {
        _.forOwn(params, function(method, param) {
            router.param(param, context.bindContext(method));
        });
    };

    return BaseController;
};

module.exports = base_controller;
