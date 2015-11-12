var mongoose = require('mongoose');
var modelName = 'Example';

var schema = new mongoose.Schema({});

//protect against re-defining
if (mongoose.modelNames().indexOf(modelName) !== -1) {
  module.exports.modelObject = mongoose.model(modelName);
} else {
  module.exports.modelObject = mongoose.model(modelName, schema);
}
