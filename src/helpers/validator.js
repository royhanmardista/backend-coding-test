function isValidString(inputString) {
  return typeof inputString === 'string' && inputString.length > 0;
}

function isValidLatitude(latitude) {
  return latitude >= -90 && latitude <= 90;
}

function isValidLongitude(longitude) {
  return longitude >= -180 && longitude <= 180;
}
exports.isValidString = isValidString;
exports.isValidLatitude = isValidLatitude;
exports.isValidLongitude = isValidLongitude;
