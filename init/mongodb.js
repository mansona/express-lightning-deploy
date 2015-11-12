var mongoose = require('mongoose');
var Q = require('q');
var util = require('util');
var winston = require('winston');

function getManyParams(keys, prefix, nconf) {
  var promises = keys.map(function(key) {
    return Q.ninvoke(nconf, 'get', prefix + key);
  });

  return Q.all(promises);
}

function buildConnectionString(nconf, configPrefix) {
  return getManyParams(['user', 'password', 'hosts', 'host', 'port', 'db'], configPrefix, nconf).then(function(results) {
    var connectionString = 'mongodb://';

    var user = results[0];
    var password = results[1];
    var hosts = results[2];
    var host = results[3];
    var port = results[4];
    var db = results[5];

    if (user) {
      connectionString += util.format('%s:%s@', user, password);
    }

    //if we have multiple dbs compile the connection string
    if (hosts) {
      connectionString += hosts.map(function(rsHost) {
        return util.format('%s:%d/%s', rsHost, port, db);
      }).join(',');
    } else {
      connectionString += util.format('%s:%d/%s', host, port, db);
    }

    return connectionString;
  });
}

module.exports = function initMongodb(nconf) {
  buildConnectionString(nconf, 'database:mongo:').then(function(connectionString) {

    if (!mongoose.connection.readyState) {
      mongoose.connect(connectionString);
    }

    mongoose.connection.on('connecting', function() {
      winston.info('Mongoose connecting');
    });

    mongoose.connection.on('connected', function() {
      winston.info('Mongoose connected', {
        connectionString: connectionString,
      });
    });

    mongoose.connection.on('error', function(err) {
      winston.error('Error connecting to mongoose', {
        error: err.message,
        stack: err.stack,
      });
    });
  })

  .then(null, function(err) {
    winston.error('error creating mongodb connection', {
      error: err.message,
      stack: err.stack,
    });
  });
};
