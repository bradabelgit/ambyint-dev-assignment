const steps = require("./steps");

module.exports = {
  execute(context) {
    return steps.verifyAddressesFileAccess(context)
      .then(steps.getAddressesFromFile)
      .then(steps.geocodeAddresses)
      .then(steps.filterGeocoded)
      .then(steps.saveResultsToFile);
  }
};