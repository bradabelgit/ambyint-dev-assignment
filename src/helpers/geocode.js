const https = require("https");
const throttleFactory = require("throttle-factory");

const getGeocodeRequestOptions = require("./get-geocode-request-options");

const throttle = throttleFactory(50, 1000);

module.exports = (address) => {
  return new Promise((resolve, reject) => {
    //Limit calls to Google API to 50 every second

    throttle.execute(() => {
      https.get(getGeocodeRequestOptions(address), (res) => {
        let result = "";

        res.setEncoding("utf8");

        res.on("data", d => result += d);

        res.on("end", () => {
          try {
            resolve(JSON.parse(result));
          }
          catch (e) {
            reject(e);
          }
        });

        res.on("error", err => reject(err));
      }).on("error", err => reject(err));
    });
  });
};
