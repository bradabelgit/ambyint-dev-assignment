function isROOFTOPQuality(geocoded) {
  return geocoded.results[0].geometry.location_type === "ROOFTOP";
}

function isNonPartialMatch(geocoded) {
  return !geocoded.results[0].partial_match;
}

function hasSingleResult(geocoded) {
  return geocoded.results.length === 1;
}

module.exports = (geocoded) => {
  return hasSingleResult(geocoded) && isNonPartialMatch(geocoded) && isROOFTOPQuality(geocoded);
};