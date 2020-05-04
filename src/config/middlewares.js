const bodyparser = require('body-parser');
//const knexLogger = require('knex-logger');
const cors = require('cors');

module.exports = (app) => {
  app.use(bodyparser.json());
  //app.use(knexLogger(app.db));
  app.use(cors({ origin: '*' }));
};