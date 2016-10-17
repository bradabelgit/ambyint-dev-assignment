const fs = require("fs");

module.exports = (context) => {
  return new Promise((resolve, reject) => {
    console.log("checking file access...");

    fs.access(context.addressFilename, fs.R_OK, err => {
      if (err) return reject(err);

      console.log("file access confirmed");

      return resolve(context);
    });
  });
};