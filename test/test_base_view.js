// jshint esversion: 6

const chai      = require('chai'),
      dirtyChai = require('dirty-chai'),
      sinon     = require('sinon'),
      sinonChai = require('sinon-chai'),
      use       = require('rekuire');

const expect = chai.expect;
chai.use(dirtyChai);

const app      = use('netdeckyr')({ squelch: true });
const BaseView = use('base_view')(app);

describe('BaseView', function() {
    describe('#constructor', function() {
        it("should have a constructor that takes two arguments (express response, template name) and returns a base view.", function(done) {
            const mockResponse = {};
            const mockTemplate = "test";
            var view = new BaseView(mockResponse, mockTemplate);
            expect(view).to.not.be.null();
            expect(view).to.be.instanceof(BaseView);
            expect(view).to.have.property('response', mockResponse);
            expect(view).to.have.property('template', mockTemplate);
            done();
        });
    });
});
