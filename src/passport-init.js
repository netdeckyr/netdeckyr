module.exports = function(passport, User) {
    var BasicStrategy = require('passport-http').BasicStrategy;

    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        new User({ id:id }).fetch().then(function(user) {
            done(null, user);
        }).catch(function(err) {
            done(err);
        });
    });

    passport.use('basic-auth', new BasicStrategy(function(email, password, done) {
        User.login(email, password).then(function(user) {
            return user ? done(null, user) : done(null, false, { message:"Invalid password" });
        }).catch(function(err) {
            return done(err);
        });
    }));
};
