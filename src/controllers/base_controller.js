// jshint esversion: 6

/**
 * @module base_controller
 * @description Provides the {@link module:base_controller~BaseController} class.
 *
 * @requires lodash
 * @requires methods
 */
var base_controller = function(app) {

    const _       = require('lodash');
    const httpMethods = require('methods');

    /**
     * @class BaseController
     * @classdesc The base controller. Provides the basic functionality of a controller, including router bindings and basic inheritance.
     * @description The BaseController constructor returns a new BaseController instance.
     *
     * @property {string} _name - The name of the controller. Should be overriden by subclasses.
     */
    const BaseController = function() {
        this._name = "base";
    };

    /**
     * @member {Array.<Object.<string, function>>} _instanceMethods
     * @memberof module:base_controller~BaseController
     * @static
     * @description The array of instance methods available in the prototype chain, in the format { name: implementation: }
     */
    BaseController._instanceMethods = [];

    /**
     * @member {Array.<Object.<string, function>>} _classMethods
     * @memberof module:base_controller~BaseController
     * @static
     * @description The array of class methods available in the prototype chain, in the format { name: implementation: }
     */
    BaseController._classMethods = [];

    /**
     * @method extend
     * @memberof module:base_controller~BaseController
     * @static
     * @description The extend method provides a method for inheriting from BaseController.
     * @param {function} child - The constructor function of the inheriting type.
     * @param {Object.<string, function>} instanceMethods - instance methods to attach to the inheriting type's prototype.
     * @param {Object.<string, function>} classMethods - class methods to attach to the inheriting type.
     *
     * @returns The inheriting constructor function with the prototype chain updated to include BaseController.
     */
    BaseController.extend = function(child, instanceMethods, classMethods) {
        child.prototype = _.create(BaseController.prototype, {
            'constructor': child,
            '_super': BaseController
        });

        child._instanceMethods = BaseController._instanceMethods.slice();
        if (instanceMethods !== undefined) {
            _.forOwn(instanceMethods, function(implementation, name) {
                child.prototype[name] = implementation;
                child._instanceMethods.push({ name: name, implementation: implementation });
            });
        }

        child._classMethods = BaseController._classMethods.slice();
        if (classMethods !== undefined) {
            _.forOwn(classMethods, function(implementation, name) {
                child[name] = implementation;
                child._classMethods.push({ name: name, implementation: implementation });
            });
        }

        return child;
    };

    BaseController._classMethods.push({ name: 'extend', implementation: BaseController.extend });

    BaseController.prototype.instanceMethods = function() {
        if (this.prototype !== undefined) {
            return _.merge(this.constructor._instanceMethods, this.prototype.instanceMethods());
        } else {
            return this.constructor._instanceMethods;
        }
    };

    BaseController._instanceMethods.push({ name: 'instanceMethods', implementation: BaseController.prototype.instanceMethods });

    BaseController.prototype.bindContext = function(method) {
        return method.bind(this);
    };

    BaseController._instanceMethods.push({ name: 'bindContext', implementation: BaseController.prototype.bindContext });

    BaseController.prototype.initialize = function(router, bindings, params) {
        setupBindings(this, router, bindings);
        setupParams(this, router, params);
    };

    BaseController._instanceMethods.push({ name: 'initialize', implementation: BaseController.prototype.initialize });

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
