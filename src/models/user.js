module.exports = function(app) {
    var Promise   = require('bluebird');
    var bookshelf = app.get('bookshelf');
    var bcrypt    = app.get('bcrypt');
    var _         = app.get('underscore');
    var debug     = app.get('debug');

    var User = bookshelf.Model.extend({
        tableName: 'users',
        initialize: function() {
            this.on('creating', this.onCreating, this);
            this.on('saving', this.onSaving, this);
        },
        format: function(attrs) {
            return _.omit(attrs, 'password');
        },
        onCreating: function() {
            var email = this.get('email').toLowerCase().trim();
            this.set('email', email);
            this.hashPassword();
            this.set('created_at', new Date());
        },
        onSaving: function() {
            this.set('updated_at', new Date());
        },
        hashPassword: function() {
            var password = this.get('password');
            var hash = bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
            this.set('password_hash', hash);
        },
        toSecureJSON: function() {
            return _.omit(this.toJSON(), ['password', 'password_hash']);
        }
    }, {
        login: Promise.method(function(email, password) {
            if (!email || !password) throw new Error('Email and password are both required');

            return new User({ email: email.toLowerCase().trim() }).fetch({ required: true }).then(function(user) {
                debug("User logging in: %j", user);
                return Promise.promisify(bcrypt.compare)(password, user.get('password_hash'));
            }).then(function(result) {
                return (result) ? user : undefined;
            });
        })
    });

    if (!bookshelf.model('User')) {
        bookshelf.model('User', User);
    }

    return User;
};
