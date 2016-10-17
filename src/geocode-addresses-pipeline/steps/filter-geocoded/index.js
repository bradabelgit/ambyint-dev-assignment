const filter = require("./filter");

module.exports = (context) => {
  context.results = context.geocoded.filter(filter);

  return Promise.resolve(context);
};