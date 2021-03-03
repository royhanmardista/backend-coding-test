const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

const rideHandler = require('./handler/rider');

module.exports = (db) => {
  app.get('/health', (req, res) => res.send('Healthy'));
  app.post('/rides', jsonParser, rideHandler.middlewareCreateValidation, rideHandler.postResource(db));
  app.get('/rides', rideHandler.getResourceList(db));
  app.get('/rides/:id', rideHandler.getSingleResource(db));
  return app;
};
