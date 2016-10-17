const fs = require("fs");
const jsonFormat = require("json-format");

module.exports = (context) => {
  return new Promise((resolve, reject) => {
    console.log("saving file...");

    fs.writeFile(context.resultsFilename, jsonFormat(context.results), err => {
      if (err) return reject(err);

      console.log(`file saved successfully to ${context.resultsFilename}`);

      return resolve();
    });
  });
};