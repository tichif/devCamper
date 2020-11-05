const NodeGeocoder = require('node-geocoder');

const options = {
  provider: 'mapquest',
  httpAdapter: 'https',
  apiKey: 'bxjDjAErtMFbUadMGU2GBddqMOKPsihC',
  formatter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
