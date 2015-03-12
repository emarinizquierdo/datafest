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
            8080

  // MongoDB connection options

  mongo: {
    uri:    process.env.MONGOLAB_URI || 
            process.env.MONGOHQ_URL ||
            process.env.OPENSHIFT_MONGODB_DB_URL+process.env.OPENSHIFT_APP_NAME ||
            "mongodb://3f978017-fe5d-4d95-8682-6fd61a3e433f:f401d412-6df8-4441-a408-0d1044a16d8e@50.23.230.141:10131/db" ||
            'mongodb://localhost/datafest'
  }
};