/*eslint-env node*/

//------------------------------------------------------------------------------
// node.js starter application for Bluemix
//------------------------------------------------------------------------------

// This application uses express as its web server
// for more info, see: http://expressjs.com
var express = require('express');
var PersonalityInsightsV3 = require('watson-developer-cloud/personality-insights/v3');
// cfenv provides access to your Cloud Foundry environment
// for more info, see: https://www.npmjs.com/package/cfenv
var cfenv = require('cfenv');
var personality_insights = new PersonalityInsightsV3({
    "url": "https://gateway.watsonplatform.net/personality-insights/api",
    "username": "7726e370-8b95-4971-a2cb-baa8e3da94ce",
    "password": "HJr6PB72wvpW",
    version_date: '2016-10-19'
});
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.send(200);
    } else {
        next();
    }
};
// create a new express server
var app = express();
app.use(allowCrossDomain);
// serve the files out of ./public as our main files
app.use(express.static(__dirname + '/public'));

// get the app environment from Cloud Foundry
var appEnv = cfenv.getAppEnv();
app.get('/', function(req, resp) {
    var out = "Hey, are you looking for something?";
    out += "  Use /personality?text=<content>";
    resp.jsonp(out);
});
app.get('/personality', function(req, res) {
    var text = req.param('text');
    var params = {
        "text": text
    }
    personality_insights.profile({
            text: text,
            consumption_preferences: true
        },
        function(err, response) {
            if (err) {
                console.log(err);
                res.jsonp(err);
            } else
                res.jsonp(response);
        });
});

// start server on the specified port and binding host
app.listen(appEnv.port, '0.0.0.0', function() {
    // print a message when the server starts listening
    console.log("server starting on " + appEnv.url);
});