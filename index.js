const express = require('express');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = 8010;

const jsonParser = bodyParser.json();

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

const buildSchemas = require('./src/schemas');
const winston = require('./config/winston');
const api = require('./src/app')(db);
const swaggerDocument = require('./config/swagger.json');

db.serialize(() => {
  buildSchemas(db);

  app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  app.use(jsonParser);
  app.use(api);

  app.listen(PORT, () => {
    winston.info(`App started and listening on PORT ${PORT}`);
  });
});
