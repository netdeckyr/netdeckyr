var path = require('path');

module.exports = {
    NODE_PATH: process.env.NODE_PATH + ":" + __dirname + ":" + path.join(__dirname, "src"),
    SQLITE3_DB_PATH: path.join(__dirname, "dev.sqlite3"),
    SQLITE3_DB_FILENAME: "dev.sqlite3",
    DB_NAME: "netdeckyr",
    DB_USERNAME: "netdeckyr",
    APPNAME: "netdeckyr",
    CONFIGURATION_ENV: "development",
    NETDECKYR_PORT: 4545
}
