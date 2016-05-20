var flag = require('node-env-flag');
var squelch = flag(process.env.NETDECKYR_SQUELCH);

var app = require('netdeckyr')({ squelch: squelch });

// Start server
var port = process.env.NETDECKYR_PORT || 8000;
app.listen(port);

var appName = process.env.APPNAME || "netdeckyr";
console.log("Starting application '" + appName + "' on port " + port);
