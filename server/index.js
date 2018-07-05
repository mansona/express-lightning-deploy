const expressHandlebars = require('express-handlebars');
const nconf = require('nconf');
const redis = require('redis');
const morgan = require('morgan');
const { promisify } = require('util');

const client = redis.createClient(nconf.get('redis'));

const zrangeAsync = promisify(client.zrange).bind(client);
const getAsync = promisify(client.get).bind(client);

module.exports = (app) => {
  // Log proxy requests
  app.use(morgan('dev'));

  app.engine('hbs', expressHandlebars());

  app.get('/revisions', async (req, res) => {
    const revisions = await zrangeAsync(`${nconf.get('lightning:appName')}:index:revisions`, 0, -1);

    const revisionDataPromises = revisions.map(async (revision) => {
      let data = await getAsync(`${nconf.get('lightning:appName')}:index:revision-data:${revision}`);

      let parsedData = JSON.parse(data)

      return {
        ...parsedData,
        shortSha: parsedData.scm.sha.substring(0, 7),
      }
    });

    const revisionData = await Promise.all(revisionDataPromises);

    console.log(revisionData);

    res.render('revisions.hbs', { revisionData });
  });

  // fall back to shipping the default index.html
  app.get('*', async (req, res) => {
    let key;

    if (req.query.revision) {
      key = req.query.revision;
    } else {
      key = await getAsync(`${nconf.get('lightning:appName')}:index:current`);
    }

    const html = await getAsync(`${nconf.get('lightning:appName')}:index:${key}`);

    res.send(html);
  });
};
