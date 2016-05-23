/* jshint esversion: 6 */

const flag    = require('node-env-flag');
const use     = require('rekuire');
const squelch = flag(process.env.NETDECKYR_SQUELCH);

var app = use('netdeckyr')({ squelch: squelch });

// Start server
var port = process.env.NETDECKYR_PORT || 8000;
app.listen(port);

var appName = process.env.APPNAME || "netdeckyr";
console.log("Starting application '" + appName + "' on port " + port);
