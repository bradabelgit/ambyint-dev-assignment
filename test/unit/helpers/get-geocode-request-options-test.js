"use strict";

describe(__filename, function () {
  before(function () {
    this.sandbox = sinon.sandbox.create();
  });

  beforeEach(function () {
    this.querystringStub = {
      stringify: this.sandbox.stub()
    };
    this.querystringStub.stringify.returns("address=123+Drive+NW&key=1A2B3C");

    this.googleMapsAPIKey = "1A2B3C";
    this.address = "123 Drive NW";

    this.sut = proxyquire("src/helpers/get-geocode-request-options", {
      "querystring": this.querystringStub,
      "../../config": {
        googleMapsAPIKey: this.googleMapsAPIKey
      }
    });
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it("should stringify the address and key query parameters", function () {
    this.sut(this.address);

    this.querystringStub.stringify.should.have.been.calledWithExactly({
      address: this.address,
      key: this.googleMapsAPIKey
    });
  });

  describe("when options are returned", function () {
    beforeEach(function () {
      this.actual = this.sut(this.address);
    });

    it("should contain the hostname `maps.googleapis.com`", function () {
      expect(this.actual).to.have.property("hostname").to.equal("maps.googleapis.com");
    });

    it("should contain the expected path", function () {
      expect(this.actual).to.have.property("path").to.equal(
        "/maps/api/geocode/json?address=123+Drive+NW&key=1A2B3C"
      );
    });
  });
});