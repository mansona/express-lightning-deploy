# Express Lightning Deploy
This repo contains a very simple NodeJS implementation of the "Ember Lightning Deploy Strategy" server made famous by [Luke Melia](https://twitter.com/lukemelia). The original talk discussing the strategy can be found here: https://www.youtube.com/watch?v=QZVYP3cPcWQ

### Why
If you don't know about the changes in Ember Cli Deploy take a look at https://www.youtube.com/watch?v=fcSL5poJ1gQ where Luke Melia and [Aaron Chambers](https://twitter.com/grandazz) lay out the improvements they have made to the Ember deployment pipeline.

This project is supposed to be a bare minimum implementation, with very few bells and whistles, of the server-side component of the lightning strategy.

### Quick Start
Clone this repo `git clone git@github.com:stonecircle/express-lightning-deploy.git` run `npm install` and then `npm start`.

You now have a running lightning deploy server (NODE_ENV is set to `development`) listening on port `3800` and serving the lightning app index prefix `lightning-app`, which means that your current active index file can be found with this Redis key: `lightning-app:index:current`.

### Revisions
This app supports custom revisions for your lightning-deploy app 🎉 to see a list of the current revisions go to http://localhost:3800/revisions and click the revision you want to see. It will then bring you to http://localhost:3800/?revision=bcda77d8e2357c7d4d707baa452a64ca and ship you the corresponding index.html file.

### Overriding the Default Settings
This app uses [nconf](https://www.npmjs.com/package/nconf), it's not important to know the workings of nconf to be able to override the settings. If you are running a development server (NODE_ENV set to `development`) you just need to create a file `settings/development.json` with the settings that you want to override. Here is an example settings file:

```json
{
  "server": {
    "runPort": 4484,
  },

  "lightning": {
    "appName": "my-super-app",
  }
}
```

### Running in production
using `npm start` starts a pm2 hosted server with NODE_ENV set to `development`. If you want to run a production server you can just run `NODE_ENV=production pm2 start app.js --name my-super-app-name`. Note that when running in production the settings file that can override default settings is `settings/production.json`
