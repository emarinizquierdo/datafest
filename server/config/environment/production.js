'use strict';

// Production specific configuration
// =================================

var env = JSON.parse(process.env.VCAP_SERVICES);

module.exports = {
  // Server IP
  ip:       process.env.VCAP_APP_HOST ||
            process.env.IP ||
            undefined,

  // Server port
  port:     process.env.VCAP_APP_PORT ||
            process.env.PORT ||
            8080

  // MongoDB connection options

  mongo: {
    uri:    process.env.MONGOLAB_URI || 
            process.env.MONGOHQ_URL ||
            env['mongodb-2.4'][0].credentials.url ||
            'mongodb://localhost/datafest'
  }
};