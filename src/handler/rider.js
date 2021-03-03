const GenericHandler = require('../module/genericHandler');
const winston = require('../../config/winston');
const { isValidString, isValidLatitude, isValidLongitude } = require('../helpers/validator');

class RideHandler extends GenericHandler {
  constructor(tableName, postAttributes) {
    super(tableName, postAttributes);
    this.middlewareCreateValidation = this.middlewareCreateValidation.bind(this);
  }

  middlewareCreateValidation(req, res, next) {
    try {
      const startLatitude = Number(req.body.start_lat);
      const startLongitude = Number(req.body.start_long);
      const endLatitude = Number(req.body.end_lat);
      const endLongitude = Number(req.body.end_long);
      const riderName = req.body.rider_name;
      const driverName = req.body.driver_name;
      const driverVehicle = req.body.driver_vehicle;

      if (!isValidLatitude(startLatitude)
        || !isValidLongitude(startLongitude)
        || !isValidLatitude(endLatitude)
        || !isValidLongitude(endLongitude)) {
        return res.status(400).send({
          error_code: 'VALIDATION_ERROR',
          message: 'Latitude must be between -90 - 90 and Langitude between -180 to 180 degrees respectively',
        });
      }

      if (!isValidString(riderName)
        || !isValidString(driverName)
        || !isValidString(driverVehicle)
      ) {
        return res.status(400).send({
          error_code: 'VALIDATION_ERROR',
          message: 'Rider, Driver name and driver vehicle  must be a non empty string',
        });
      }

      // const invalid;
      const postData = [
        req.body.start_lat,
        req.body.start_long,
        req.body.end_lat,
        req.body.end_long,
        req.body.rider_name,
        req.body.driver_name,
        req.body.driver_vehicle,
      ];
      req.postData = postData;
      return next();
    } catch (err) {
      winston.error(err);
      return res.status(500).send({
        error_code: 'SERVER_ERROR',
        message: `Could not create new ${this.tableName}`,
      });
    }
  }
}

const rideHandler = new RideHandler('Rides', ['startLat', 'startLong', 'endLat', 'endLong', 'riderName', 'driverName', 'driverVehicle']);

module.exports = rideHandler;
