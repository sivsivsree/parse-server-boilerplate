// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var ParseDashboard = require('parse-dashboard');

var databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;
// Serve the Parse API on the /parse URL prefix
var mountPath = process.env.PARSE_MOUNT || '/parse';
var port = process.env.PORT || 1337;


var app = express();

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || "APPLICATION_ID",
  masterKey: process.env.MASTER_KEY || "MASTER_KEY", //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'https://localhost:1337/parse',  // Don't forget to change to https if needed
  liveQuery: {
    classNames: ['FileUpload','GameScore'] // List of classes to support for query subscriptions
  }
});

var dashboard = new ParseDashboard({
    "apps": [
        {
            "serverURL": process.env.SERVER_URL,
            "appId": "APPLICATION_ID",
            "masterKey": "MASTER_KEY",
            "appName": "Test Application",
            "clientKey": "2ead5328dda34e688816040a0e78948a"
        }
    ]
});


app.use(mountPath, api);
app.use('/dashboard', dashboard);


app.get('/', function(req, res) {
  res.status(200).send('All good - Siv.');
});



var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('Server running ' + process.env.SERVER_URL + ' on port ' + port + '.');
});


ParseServer.createLiveQueryServer(httpServer);
