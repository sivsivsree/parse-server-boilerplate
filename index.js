
var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var ParseDashboard = require('parse-dashboard');
const PORT = process.env.PORT || 5000 ;
const SPORT = 4040;

var app = express();

var api = new ParseServer({
    databaseURI: 'mongodb://tristar_dev:1234@ds227459.mlab.com:27459/tristar_android', // Connection string for your MongoDB database
    appId: 'APPLICATION_ID',
    masterKey: 'MASTER_KEY', // Keep this key secret!
    fileKey: 'optionalFileKey',
    serverURL: 'http://localhost:1337/parse', // Don't forget to change to https if needed 
    liveQuery: {
        classNames: ['FileUpload','GameScore']
    }
});

var dashboard = new ParseDashboard({
    "apps": [
        {
            "serverURL": "http://localhost:1337/parse",
            "appId": "APPLICATION_ID",
            "masterKey": "MASTER_KEY",
            "appName": "Test Application",
            "clientKey": "2ead5328dda34e688816040a0e78948a"
        }
    ]
});

// Serve the Parse API on the /parse URL prefix
app.use('/parse', api);
app.use('/dashboard', dashboard);

var httpServer = require('http').createServer(app);
httpServer.listen(SPORT);
var parseLiveQueryServer = ParseServer.createLiveQueryServer(httpServer);

app.listen(PORT, function() {
    console.log('parse-server-example running on port '+ PORT);
});
