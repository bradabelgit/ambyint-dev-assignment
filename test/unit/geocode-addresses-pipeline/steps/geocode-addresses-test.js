"use strict";

describe(__filename, function () {
  before(function () {
    this.sandbox = sinon.sandbox.create();
  });

  beforeEach(function () {
    this.geocodeStub = this.sandbox.stub();

    this.sut = proxyquire("src/geocode-addresses-pipeline/steps/geocode-addresses", {
      "src/helpers/geocode": this.geocodeStub
    });

    this.context = {
      addresses: []
    };
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  describe("when there are no addresses", function () {
    beforeEach(function () {
      this.actual = this.sut(this.context);
    });

    it("should geocode no addresses", function () {
      expect(this.geocodeStub).to.not.be.called;
    });

    it("should eventually resolve with no geocoded addresses", function () {
      return expect(this.actual.then(o => o.geocoded)).to.eventually.deep.equal([]);
    });
  });

  describe("when there is 1 address", function () {
    beforeEach(function () {
      this.context.addresses.push({});
    });

    it("should geocode 1 address", function () {
      this.sut(this.context);

      expect(this.geocodeStub).to.be.calledOnce;
    });

    describe("on geocoding failure", function () {
      it("should eventually reject with the expected error", function () {
        this.geocodeStub.rejects("Geocoding failed");
        const actual = this.sut(this.context);

        return expect(actual).to.eventually.be.rejectedWith("Geocoding failed");
      });
    });

    describe("on geocoding success", function () {
      it("should eventually resolve with 1 geocoded address", function () {
        this.geocodeStub.resolves("Geocoded 1");
        const actual = this.sut(this.context);

        return expect(actual.then(o => o.geocoded)).to.eventually.deep.equal(["Geocoded 1"]);
      });
    });
  });

  describe("when there are 2 addresses", function () {
    beforeEach(function () {
      this.context.addresses.push({}, {});
    });

    it("should geocode 2 addresses", function () {
      this.sut(this.context);

      expect(this.geocodeStub).to.have.been.calledTwice;
    });

    describe("when geocoding the first address failed", function () {
      it("should eventually reject with the expected error", function () {
        this.geocodeStub.onCall(0).rejects("Geocoding Failed");
        const actual = this.sut(this.context);

        return expect(actual).to.be.rejectedWith("Geocoding Failed");
      });
    });

    describe("when geocoding the second address failed", function () {
      it("should eventually reject with the expected error", function () {
        this.geocodeStub.onCall(1).rejects("Geocoding Failed");
        const actual = this.sut(this.context);

        return expect(actual).to.be.rejectedWith("Geocoding Failed");
      });
    });

    describe("on geocoding success", function () {
      it("should eventually resolve with 2 geocoded addresses", function () {
        this.geocodeStub.onCall(0).resolves("Geocoded 1");
        this.geocodeStub.onCall(1).resolves("Geocoded 2");
        const actual = this.sut(this.context);

        return expect(actual.then(o => o.geocoded)).to.eventually.deep.equal(["Geocoded 1", "Geocoded 2"]);
      });
    });
  });
});