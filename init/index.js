var initialised = false;

module.exports = function(nconf) {
  if (initialised) {
    return;
  }

  require('./mongodb')(nconf);
  initialised = true;
};
