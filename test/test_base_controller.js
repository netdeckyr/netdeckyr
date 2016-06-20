// jshint esversion: 6

const chai      = require('chai'),
      dirtyChai = require('dirty-chai'),
      supertest = require('supertest-as-promised'),
      sinon     = require('sinon'),
      sinonChai = require('sinon-chai'),
      express   = require('express'),
      util      = require('util'),
      _         = require('lodash'),
      use       = require('rekuire'),
      expect    = chai.expect;

chai.use(dirtyChai);
chai.use(sinonChai);

const app = express();
const BaseController = use('base_controller')(app);
const noop = function() {};

describe('BaseController', function() {
    var TestController;

    before(function() {
        TestController = BaseController.extend(function(test) {
            this.test = test;
        }, {
            testMethod: function(request, response) {
                response.send(this.test);
            },

            testParams: function(request, response) {
                response.send(request.param);
            },

            testPostMethod: function(request, response) {
                reponse.send(request.body);
            },

            handleTestParam: function(request, response, next, param) {
                request.param = param;
                next();
            }
        });
    });

    describe('#constructor', function() {
        it('should return an instance of BaseController', function() {
            const controller = new BaseController();
            expect(controller).to.not.be.undefined();
            expect(controller).to.be.instanceof(BaseController);
        });
    });

    describe('#initialize', function() {
        it('should take in an express.Router and appropriately set up parameters and define routes using the provided bindings', function() {
            const controller = new TestController();
            const route = '/test';
            const testMethodRoute = '/method';
            const testParamsRoute = '/:param';
            const testParam = 'param';
            const router = express.Router();

            // Build bindings
            let bindings = {};
            bindings[testMethodRoute] = controller.testMethod;
            bindings[testParamsRoute] = controller.testParams;

            // Build params
            let params = {};
            params[testParam] = controller.handleTestParam;

            controller.initialize(router, bindings, params);

            app.use(route, router);

            return supertest(app).get(route + testMethodRoute)
            .expect(200)
            .then(function() {
                return supertest(app).get(route + '/' + testParam)
                .expect(200)
                .expect(testParam);
            });
        });

        it('should allow bindings entries to include a dictionary to specify bindings for each HTTP verb', function() {
            const expressListRoutes = require('express-list-routes');
            const controller = new TestController();
            const route = '/test';
            const testMethodRoute = '/method';
            const router = express.Router();

            // Build bindings
            let bindings = {};
            bindings[testMethodRoute] = {
                'get': controller.testMethod,
                'post': controller.testPostMethod
            };

            controller.initialize(router, bindings);

            app.use(route, router);

            expressListRoutes({ prefix: route }, 'API:', router);

            return Promise.all([
                supertest(app).get(route + testMethodRoute).expect(200),
                supertest(app).post(route + testMethodRoute).expect(200),
                supertest(app).head(route + testMethodRoute).expect(404),
                supertest(app).get('/wrong').expect(404)
            ]);
        });
    });

    describe('#extend', function() {
        it('should return a child extended from BaseController', function() {
            const testValue = 'testing';
            var controller = new TestController(testValue);

            expect(controller).to.not.be.undefined();
            expect(controller).to.be.instanceof(BaseController);
            expect(controller).to.be.instanceof(TestController);
            expect(controller).to.have.property('test', testValue);
            expect(controller).to.respondTo('testMethod');
        });

        it('should set up instance and class methods appropriately', function() {
            const testFnRetVal = 10;
            const testClassFnRetVal = 20;

            const constructor = function() {
                this._super.call(this);
                this.mock = 'mock';
            };

            const instanceMethods = {
                mockFn: function(request, response) {
                    response.send('hello world');
                },
                testFn: function() {
                    return testFnRetVal;
                }
            };

            const classMethods = {
                testClassFn: function() {
                    return testClassFnRetVal;
                }
            };

            const MockController = BaseController.extend(constructor, instanceMethods, classMethods);

            expect(MockController).itself.to.respondTo('classMethods');
            expect(MockController).itself.to.respondTo('extend');
            expect(MockController).itself.to.respondTo('testClassFn');
            expect(MockController.testClassFn()).to.equal(testClassFnRetVal);
            expect(MockController.classMethods()).to.have.length(Object.keys(classMethods).length + BaseController.classMethods().length);
        });
    });

    describe('#bindContext', function() {
        it('should define a bindContext method', function() {
            const controller = new TestController();

            expect(controller.bindContext).to.not.be.undefined();
        });

        it('should be able to be bound to an express.Router route', function() {
            const testValue = 'testing';
            const controller = new TestController(testValue);
            const route = '/test';
            let handler = sinon.spy(controller.bindContext(controller.testMethod));

            // Set up the test route
            app.get(route, handler);

            return supertest(app).get(route)
            .expect(200)
            .expect(testValue)
            .then(function() {
                expect(handler).to.have.been.called();
            });
        });
    });

    describe('#instanceMethods', function() {
        it('should define an instanceMethods method', function() {
            const MockController = BaseController.extend(function() {});
            var controller = new MockController();

            expect(controller).to.respondTo('instanceMethods');
        });

        it('should return all of the instance methods in the prototype chain', function() {
            const MockController = BaseController.extend(noop, {
                testMethod: noop
            });

            var controller = new MockController();
            expect(controller.instanceMethods()).to.be.length(4);
        });
    });
});
