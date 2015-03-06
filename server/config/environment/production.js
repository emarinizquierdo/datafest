'use strict';

// Production specific configuration
// =================================
module.exports = {
  // Server IP
  ip:       process.env.VCAP_APP_HOST ||
            process.env.IP ||
            undefined,

  // Server port
  port:     process.env.VCAP_APP_PORT ||
            process.env.PORT ||
            8080,

  // MongoDB connection options
  mongo: {
    uri:    process.env.MONGOLAB_URI ||
            process.env.MONGOHQ_URL ||
            process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME ||
            'mongodb://localhost/datafest'
  }
};