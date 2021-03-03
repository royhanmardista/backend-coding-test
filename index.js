const express = require('express');

const app = express();
const PORT = 8010;

// const bodyParser = require('body-parser');
// const jsonParser = bodyParser.json();

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(':memory:');

const buildSchemas = require('./src/schemas');
const winston = require('./config/winston');

db.serialize(() => {
  buildSchemas(db);

  // const app = require('./src/app')(db);

  app.listen(PORT, () => {
    winston.info(`App started and listening on PORT ${PORT}`);
  });
});
