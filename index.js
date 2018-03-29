// Example express application adding the parse-server module to expose Parse
// compatible API routes.

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
const path = require('path');
const ParseDashboard = require('parse-dashboard');

const databaseUri = process.env.DATABASE_URI || process.env.MONGODB_URI;
// Serve the Parse API on the /parse URL prefix
const mountPath = process.env.PARSE_MOUNT || '/parse';
const port = process.env.PORT || 1337;
const app = express();

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

let api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || "APPLICATION_ID",
  masterKey: process.env.MASTER_KEY || "MASTER_KEY", //Add your master key here. Keep it secret!
  serverURL: process.env.SERVER_URL || 'https://localhost:1337/parse',  // Don't forget to change to https if needed
  liveQuery: {
    classNames: ['FileUpload','GameScore'] // List of classes to support for query subscriptions
  }
});

let dashboard = new ParseDashboard({
    "allowInsecureHTTP": true,
    "apps": [
        {
            "serverURL": process.env.SERVER_URL,
            "appId": "APPLICATION_ID",
            "masterKey": "MASTER_KEY",
            "appName": "loggerApplication",
            "clientKey": "2ead5328dda34e688816040a0e78948a"
        }
    ]
});


app.use(mountPath, api);


app.get('/', function(req, res) {
  res.status(200).send('All good - Siv.');
});



let httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('Server running ' + process.env.SERVER_URL + ' on port ' + port + '.');
});


ParseServer.createLiveQueryServer(httpServer);
