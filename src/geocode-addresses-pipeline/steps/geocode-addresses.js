const geocode = require("src/helpers/geocode");

module.exports = (context) => {
  return new Promise((resolve, reject) => {
    console.log("geocoding addresses...");

    const geocodeRequests = context.addresses.map(address => geocode(address));

    Promise.all(geocodeRequests)
      .then(geocoded => {
        console.log("geocoding complete");

        context.geocoded = geocoded;

        return resolve(context);
      })
      .catch(err => reject(err));
  });
};