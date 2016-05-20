var path = require('path');
var projectDirectory = path.resolve(__dirname, '..');

module.exports = {
    NODE_PATH: process.env.NODE_PATH + ":" + projectDirectory + ":" + path.join(projectDirectory, "src"),
    SQLITE3_DB_PATH: path.join(projectDirectory, "dev.sqlite3"),
    SQLITE3_DB_FILENAME: "dev.sqlite3",
    DB_NAME: "netdeckyr",
    DB_USERNAME: "netdeckyr",
    APPNAME: "netdeckyr",
    CONFIGURATION_ENV: "development",
    NETDECKYR_PORT: 4545,
    DEPLOYMENT_DIRECTORY: path.join(projectDirectory, "site")
}
