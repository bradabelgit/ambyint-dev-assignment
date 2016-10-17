const fs = require("fs");
const parse = require("csv-parse");

module.exports = (context) => {
  return new Promise((resolve, reject) => {
    console.log("loading file contents...");

    const parser = parse({columns: true}, (err, data) => {
      if (err) return reject(err);
      console.log("file contents loaded");

      context.addresses = data.map(d => d.Address);

      return resolve(context);
    });

    const addressReadStream = fs.createReadStream(context.addressFilename);

    addressReadStream.on("error", err => reject(err));
    addressReadStream.pipe(parser);
  });
};