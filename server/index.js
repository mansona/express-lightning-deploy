var autoroute = require('express-autoroute');
var bodyParser = require('body-parser');
var nconf = require('nconf');

module.exports = function(app) {
  // Log proxy requests
  var morgan = require('morgan');
  app.use(morgan('dev'));

  app.use(bodyParser.urlencoded());
  app.use(bodyParser.json());

  app.use(require('express-session')({
    secret: nconf.get('server:session_secret'),
    resave: false,
    saveUninitialized: true,
  }));

  autoroute(app, {
    routesDir: __dirname + '/routes',
    logger: require('winston'),
  });
};
