const querystring = require("querystring");
const { googleMapsAPIKey } = require("../../config");

module.exports = (address) => ({
  hostname: "maps.googleapis.com",
  path: `/maps/api/geocode/json?${querystring.stringify({address, key: googleMapsAPIKey})}`
});