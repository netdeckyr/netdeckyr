
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function(table) {
        table.increments();
        table.string('username').unique();
        table.string('first_name');
        table.string('last_name');
        table.string('email').unique();
        table.string('password_hash');
        table.timestamps();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');
};
