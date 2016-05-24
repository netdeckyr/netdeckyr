/* jshint esversion: 6 */
/* jshint expr: true */

const expect = require('chai').expect;
const bcrypt = require('bcrypt');
const use    = require('rekuire');
const app    = use('netdeckyr')();
const User   = use('user')(app);

describe('User', function() {
    beforeEach(function(done) {
        // Clear the users database
        app.get('bookshelf').knex('users').del().then(function() {
            done();
        });
    });

    after(function(done) {
        // Destroy the knex instance
        app.get('bookshelf').knex.destroy();
        done();
    });

    describe('#initialize()', function() {
        beforeEach(function(done) {
            app.get('bookshelf').knex('users').del().then(function() {
                done();
            });
        });

        it('should successfully create a user and save it to the database', function(done) {
            var userTestData = {
                first_name: "Test",
                last_name: "Test",
                email: "test@test.com",
                password: "secret"
            };
            new User(userTestData).save().then(function(user) {
                expect(user.get("first_name")).to.equal(userTestData.first_name);
                expect(user.get("last_name")).to.equal(userTestData.last_name);
                expect(user.get("email")).to.equal(userTestData.email);
                expect(user.get("password_hash")).to.not.be.null;
                done();
            });
        });

        it('should successfuly create multiple users and save them to the database', function(done) {
            // TODO: Create multiple users and save them, then confirm they are retrievable
            done();
        });

        it('should hash the user\'s password on create', function(done) {
            var password = 'secret';
            var userTestData = {
                first_name: "Test",
                last_name: "Test",
                email: "test@test.com",
                password: password
            };

            new User(userTestData).save().then(function(user) {
                expect(bcrypt.compareSync(password, user.get('password_hash'))).to.be.true;
                done();
            });
        });
    });

    describe('#toSecureJSON()', function() {
        var testEmail = "test@test.com";

        beforeEach(function(done) {
            new User({
                first_name: "Test",
                last_name: "Test",
                email: testEmail,
                password: "secret"
            }).save().then(function(user) {
                done();
            });
        });

        it('should return all properties of the model except for password and password_hash', function(done) {
            new User({ email: testEmail }).fetch({ require: true }).then(function(user) {
                userObj = user.toSecureJSON();
                expect(userObj).to.have.a.property('first_name');
                expect(userObj).to.have.a.property('last_name');
                expect(userObj).to.have.a.property('email');
                expect(userObj).not.to.have.a.property('password');
                expect(userObj).not.to.have.a.property('password_hash');
                done();
            });
        });
    });
});
