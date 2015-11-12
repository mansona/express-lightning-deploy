var autoroute = require('express-autoroute');
var bodyParser = require('body-parser');
var nconf = require('nconf');
var bluebird = require('bluebird');

var redis = require('redis');
var client = redis.createClient();
bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

module.exports = function(app) {
  // Log proxy requests
  var morgan = require('morgan');
  app.use(morgan('dev'));

  //fall back to shipping the default index.html
  app.get('*', function(req, res) {

    return client.getAsync('workrural-app:index:current')

    .then(function(key) {
      return client.getAsync(`workrural-app:index:${key}`);
    })

    .then(function(html) {
      res.send(html);
    });
  });
};
