const config = require("../config");
const geocodeAddresses = require("./geocode-addresses-pipeline");

const context = Object.assign({}, config);

geocodeAddresses.execute(context)
  .then(() => {
    console.log("geocoding complete");
  })
  .catch(err => console.log(err));