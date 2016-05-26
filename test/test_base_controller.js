// jshint esversion: 6

const chai      = require('chai'),
      dirtyChai = require('dirty-chai'),
      supertest = require('supertest-as-promised'),
      sinon     = require('sinon'),
      sinonChai = require('sinon-chai'),
      express   = require('express'),
      util      = require('util'),
      use       = require('rekuire'),
      expect    = chai.expect;

chai.use(dirtyChai);
chai.use(sinonChai);

const app = use('netdeckyr')({ squelch: true });
const BaseController = use('base_controller')(app);

describe('BaseController', function() {
    var TestController;

    before(function() {
        TestController = BaseController.extend(function(test) {
            BaseController.call(this);
            this.test = test;
            this.name = 'test';
        });

        TestController.prototype.testMethod = function(request, response) {
            response.send(this.test);
        };
    });

    describe('#constructor', function() {
        it('should return an instance of BaseController', function() {
            const controller = new BaseController();
            expect(controller).to.not.be.undefined();
            expect(controller).to.be.instanceof(BaseController);
        });

        it('should have a name property set to \'base\'', function() {
            const controller = new BaseController();
            expect(controller).to.have.property('name', 'base');
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
            expect(controller).to.have.property('name', 'test');
            expect(controller).to.have.property('testMethod');
        });
    });

    describe('#bindContext', function() {
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
});
