describe(__filename, function () {
  before(function () {
    this.sut = require("src/geocode-addresses-pipeline/steps/filter-geocoded/filter");

    this.geocoded = {};
  });

  describe("when there are 0 results", function () {
    it("should return false", function () {
      this.geocoded.results = [];
      const actual = this.sut(this.geocoded);

      expect(actual).to.equal(false);
    });
  });

  describe("when there are more then 1 result", function () {
    it("should return false", function () {
      this.geocoded.results = [{}, {}];
      const actual = this.sut(this.geocoded);

      expect(actual).to.equal(false);
    });
  });

  describe("when there is exactly 1 result", function () {
    beforeEach(function () {
      this.geocoded.results = [{
        geometry: {}
      }];
    });

    describe("when the result is a partial_match", function () {
      it("should return false", function () {
        this.geocoded.results[0].partial_match = true;
        const actual = this.sut(this.geocoded);

        expect(actual).to.equal(false);
      });
    });

    describe("when the result is a non-partial_match", function () {
      beforeEach(function () {
        delete this.geocoded.results[0].partial_match;
      });

      describe("when the result is not of ROOFTOP quality", function () {
        it("should return false", function () {
          this.geocoded.results[0].geometry.location_type = "APPROXIMATE";
          const actual = this.sut(this.geocoded);

          expect(actual).to.equal(false);
        });
      });

      describe("when the result is of ROOFTOP quality", function () {
        it("should return true", function () {
          this.geocoded.results[0].geometry.location_type = "ROOFTOP";
          const actual = this.sut(this.geocoded);

          expect(actual).to.equal(true);
        });
      });
    });
  });
});