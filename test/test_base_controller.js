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

describe('BasicController', function() {

    describe('#constructor', function() {
    });

    describe('Interaction with express.Router', function() {
        it('should be able to be bound to an express.Router route.', function(done) {
            const mockController = { test: sinon.stub() };
            const testRoute = '/test';
            const request = { url: testRoute, method: 'GET' };
            const response = { end: function() {} };

            app.get(testRoute, mockController.test.bind(mockController));

            supertest(app).get(testRoute).then(function() {
                return expect(mockController.test).to.have.been.calledWith(mockController);
                done();
            });
        });
    });
});
