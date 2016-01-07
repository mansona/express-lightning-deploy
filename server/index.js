var bluebird = require('bluebird');
var expressHandlebars = require('express-handlebars');
var nconf = require('nconf');
var redis = require('redis');

var client = redis.createClient(nconf.get('redis'));
var Promise = bluebird; //for style

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

module.exports = function(app) {
  // Log proxy requests
  var morgan = require('morgan');
  app.use(morgan('dev'));

  app.engine('hbs', expressHandlebars());

  app.get('/revisions', function(req, res) {
    return client.zrangeAsync(`${nconf.get('lightning:appName')}:index:revisions`, 0, -1)

    .then(function(revisions) {
      res.render('revisions.hbs', {revisions: revisions});
    });
  });

  //fall back to shipping the default index.html
  app.get('*', function(req, res) {

    Promise.resolve().then(function() {
      if (req.query.revision) {
        return req.query.revision;
      }

      return client.getAsync(`${nconf.get('lightning:appName')}:index:current`);
    })

    .then(function(key) {
      return client.getAsync(`${nconf.get('lightning:appName')}:index:${key}`);
    })

    .then(function(html) {
      res.send(html);
    });
  });
};
