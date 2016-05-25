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

const app       = use('netdeckyr')({ squelch: true });
const Router    = use('router')(app, express);

describe('Router', function() {
    describe('#constructor', function() {
        it('should have a constructor that takes a single argument (controller) and returns an enhanced express router.', function(done) {
            const mockController = {};
            var router = new Router(mockController);
            expect(router).to.not.be.null();
            expect(router).to.be.instanceof(Router);
            expect(router).to.have.property('controller', mockController);
            expect(router).to.have.property('get');
            done();
        });
    });

    describe('HTTP Handler Methods', function() {
        describe('#get', function() {
            it('should override the http handler methods of express router to take a route and controller method name.', function() {
                const mockController = { test: sinon.stub() };
                const testRoute = '/test';
                const request = { url: testRoute, method: 'GET' };
                const response = { end: function() {} };

                var router = new Router(mockController);
                router.get(testRoute, mockController.test);

                app.use('/', router);

                return supertest(app).get(testRoute).then(function() {
                    expect(mockController.test).to.have.been.called();
                });
            });
        });
    });
});
