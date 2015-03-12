/**
 * Main application file
 */

'use strict';

// There are many useful environment variables available in process.env.
// VCAP_APPLICATION contains useful information about a deployed application.
var appInfo = JSON.parse(process.env.VCAP_APPLICATION || "{}");
// TODO: Get application information and use it in your app.

// VCAP_SERVICES contains all the credentials of services bound to
// this application. For details of its content, please refer to
// the document or sample of each service.
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
// TODO: Get service credentials and communicate with bluemix services.

// Set default node environment to development
process.env.NODE_ENV = (appInfo.application_name) ? 'production' : 'development';

var express = require('express');
var mongoose = require('mongoose');
var config = require('./config/environment');
var cronner = require('./cron');

if (process.env.VCAP_SERVICES) {
   config.mongo.uri = services['mongodb-2.4'][0].credentials.url;
}

// Connect to database
mongoose.connect(config.mongo.uri, config.mongo.options);
cronner.start();

// Populate DB with sample data
if(config.seedDB) { require('./config/seed'); }

// Setup server
var app = express();
var server = require('http').createServer(app);
require('./config/express')(app);
require('./routes')(app);

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;