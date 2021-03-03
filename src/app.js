const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const jsonParser = bodyParser.json();

module.exports = (db) => {
  app.get('/health', (req, res) => res.send('Healthy'));

  app.post('/rides', jsonParser, (req, res) => {
    const startLatitude = Number(req.body.start_lat);
    const startLongitude = Number(req.body.start_long);
    const endLatitude = Number(req.body.end_lat);
    const endLongitude = Number(req.body.end_long);
    const riderName = req.body.rider_name;
    const driverName = req.body.driver_name;
    const driverVehicle = req.body.driver_vehicle;

    if (startLatitude < -90
      || startLatitude > 90
      || startLongitude < -180
      || startLongitude > 180
    ) {
      return res.status(400).send({
        error_code: 'VALIDATION_ERROR',
        message: 'Start latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
      });
    }

    if (endLatitude < -90 || endLatitude > 90 || endLongitude < -180 || endLongitude > 180) {
      return res.status(400).send({
        error_code: 'VALIDATION_ERROR',
        message: 'End latitude and longitude must be between -90 - 90 and -180 to 180 degrees respectively',
      });
    }

    if (typeof riderName !== 'string' || riderName.length < 1) {
      return res.status(400).send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      });
    }

    if (typeof driverName !== 'string' || driverName.length < 1) {
      return res.status(400).send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      });
    }

    if (typeof driverVehicle !== 'string' || driverVehicle.length < 1) {
      return res.status(400).send({
        error_code: 'VALIDATION_ERROR',
        message: 'Rider name must be a non empty string',
      });
    }

    const values = [
      req.body.start_lat,
      req.body.start_long,
      req.body.end_lat,
      req.body.end_long,
      req.body.rider_name,
      req.body.driver_name,
      req.body.driver_vehicle,
    ];

    db.run('INSERT INTO Rides(startLat, startLong, endLat, endLong, riderName, driverName, driverVehicle) VALUES (?, ?, ?, ?, ?, ?, ?)', values, function getCreatedRide(err) {
      if (err) {
        return res.status(500).send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }

      db.get('SELECT * FROM Rides WHERE rideID = ?', this.lastID, (selectError, row) => {
        if (selectError) {
          return res.status(500).send({
            error_code: 'SERVER_ERROR',
            message: 'Unknown error',
          });
        }

        return res.send(row);
      });
      return null;
    });
    return null;
  });

  app.get('/rides', (req, res) => {
    let numRows;
    let numPages;
    let { pageIndex, itemsPerPage } = req.query;
    itemsPerPage = parseInt(itemsPerPage, 10) || 1;
    pageIndex = parseInt(pageIndex, 10) || 1;
    const pageIndexNumber = pageIndex > 0 ? pageIndex : 1;
    const skip = (pageIndexNumber - 1) * itemsPerPage;
    const limit = `${skip},${itemsPerPage}`;

    db.get('SELECT count(*) as numRows FROM Rides', (err, row) => {
      if (err) {
        return res.status(500).send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }

      numRows = row.numRows;
      numPages = Math.ceil(numRows / itemsPerPage);

      db.all(`SELECT * FROM Rides DESC LIMIT ${limit}`, (pgError, items) => {
        if (pgError) {
          return res.status(500).send({
            error_code: 'SERVER_ERROR',
            message: 'Unknown error',
          });
        }
        const responsePayload = {
          items,
        };
        responsePayload.pagination = {
          pageIndex: pageIndexNumber,
          previous: pageIndexNumber > 1 ? pageIndexNumber - 1 : '#',
          next: pageIndexNumber < numPages ? pageIndexNumber + 1 : '#',
          itemsPerPage,
          totalItems: numRows,
          currentItemCount: items.length,
          totalPages: Math.ceil(numRows / itemsPerPage),
        };
        return res.json(responsePayload);
      });
      return null;
    });
  });

  app.get('/rides/:id', (req, res) => {
    db.get(`SELECT * FROM Rides WHERE rideID='${req.params.id}'`, (err, row) => {
      if (err) {
        return res.status(500).send({
          error_code: 'SERVER_ERROR',
          message: 'Unknown error',
        });
      }

      if (!row) {
        return res.status(404).send({
          error_code: 'RIDES_NOT_FOUND_ERROR',
          message: 'Could not find any rides',
        });
      }

      return res.send(row);
    });
  });

  return app;
};
