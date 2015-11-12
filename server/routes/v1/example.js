var autorouteJson = require('express-autoroute-json');
var models = require('../../../models');

module.exports.autoroute = autorouteJson({
  model: models.amenity,
  resource: 'example', //this will be pluralised in the routes

  //default CRUD
  find: {},
  create: {},
  update: {},
  delete: {},
});
