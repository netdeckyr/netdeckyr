var path = require('path');

module.exports = {
    NODE_PATH: process.env.NODE_PATH + ":" + __dirname + ":" + path.join(__dirname, "src"),
    SQLITE3_DB_PATH: path.join(__dirname, "test.sqlite3"),
    SQLITE3_DB_FILENAME: "test.sqlite3",
    DB_NAME: "netdeckyr_test",
    DB_USERNAME: "netdeckyr_test",
    APPNAME: "netdeckyr",
    CONFIGURATION_ENV: "test",
    NETDECKYR_PORT: 4545
}
