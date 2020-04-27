const bodyparser = require('body-parser');
const knexLogger = require('knex-logger');

module.exports = (app) => {
  app.use(bodyparser.json());
  //app.use(knexLogger(app.db));
};