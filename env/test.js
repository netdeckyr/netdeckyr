var path = require('path');
var projectDirectory = path.resolve(__dirname, '..');

module.exports = {
    SQLITE3_DB_PATH: path.join(projectDirectory, "test.sqlite3"),
    SQLITE3_DB_FILENAME: "test.sqlite3",
    DB_NAME: "netdeckyr_test",
    DB_USERNAME: "netdeckyr_test",
    APPNAME: "netdeckyr",
    CONFIGURATION_ENV: "test",
    NETDECKYR_PORT: 4545,
    DEPLOYMENT_DIRECTORY: path.join(projectDirectory, "site")
}
