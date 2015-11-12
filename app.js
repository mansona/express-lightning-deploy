var cors = require('cors');
var express = require('express');
var winston = require('winston');

var settings = require('./settings');

//remove it so to add it with my settings
winston.remove(winston.transports.Console);

var winstonOptions = {
  colorize: true,
  timestamp: true,
  handleExceptions: true,
  prettyPrint: true,
};

if (process.env.LOG_LEVEL) {
  winstonOptions.level = process.env.LOG_LEVEL;
} else if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test') {
  winstonOptions.level = 'debug';
} else {
  winstonOptions.level = 'info';
}

winston.add(winston.transports.Console, winstonOptions);

var app = express();

if (settings.server.useCors) {
  app.use(cors());
}

var appRoutes = require('./server');

appRoutes(app);

var server = app.listen(settings.server.runPort, function() {
  winston.info('Server listening', {
    host: server.address().address,
    port: server.address().port,
  });
});
