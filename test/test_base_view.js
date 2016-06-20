// jshint esversion: 6

const chai      = require('chai'),
      dirtyChai = require('dirty-chai'),
      sinon     = require('sinon'),
      sinonChai = require('sinon-chai'),
      util      = require('util'),
      use       = require('rekuire');

const expect = chai.expect;
chai.use(dirtyChai);

const app      = use('netdeckyr')({ squelch: true });
const BaseView = use('base_view')(app);

describe('BaseView', function() {
    describe('#constructor', function() {
        it("should have a constructor that takes two arguments (express response, template name) and returns a base view", function(done) {
            const mockResponse = {};
            const mockTemplate = "test";
            var view = new BaseView(mockResponse, mockTemplate);
            expect(view).to.not.be.null();
            expect(view).to.be.instanceof(BaseView);
            expect(view).to.have.property('response', mockResponse);
            expect(view).to.have.property('template', mockTemplate);
            expect(view).to.respondTo('render');
            done();
        });

    });

    describe('::extend', function() {
        it("should provide an extend method to create subclasses", function() {
            expect(BaseView).itself.to.respondTo('extend');
            const MockView = BaseView.extend(function(value) {
                this.test = value;
            });
            const testValue = "test";
            let instance = new MockView(testValue);
            expect(instance).to.have.property('test', testValue);
        });
    });

    describe('#render', function() {
        it("should provide a render method that takes template bindings", function() {
            let responseMock = { render: sinon.spy() };
            const bindings   = { test: 'test' };
            const template   = 'test';

            let instance = new BaseView(responseMock, template);
            expect(instance).to.respondTo('render');

            instance.render(bindings);
            expect(responseMock.render).to.have.been.called();
            expect(responseMock.render).to.have.been.calledWith(template, bindings);
        });
    });
});
