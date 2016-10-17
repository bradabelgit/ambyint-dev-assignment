"use strict";

describe(__filename, function () {
  before(function () {
    this.sandbox = sinon.sandbox.create();
  });

  beforeEach(function () {
    this.fsAccessStub = this.sandbox.stub();

    this.sut = proxyquire("src/geocode-addresses-pipeline/steps/verify-addresses-file-access", {
      "fs": {
        access: this.fsAccessStub,
        R_OK: "R_OK"
      }
    });

    this.context = {
      addressFilename: "addresses.csv"
    };
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it("should have attempted to access fs with the filename `addresses.csv` and read rights", function () {
    this.sut(this.context);

    expect(this.fsAccessStub).to.have.been.calledWithExactly("addresses.csv", "R_OK", sinon.match.func);
  });

  describe("on addresses file access failure", function () {
    it("should eventually reject with the error", function () {
      this.fsAccessStub.yields("ERROR");
      const actual = this.sut(this.context);

      return expect(actual).to.eventually.be.rejectedWith("ERROR");
    });
  });

  describe("on addresses file access success", function () {
    it("should eventually reject with the context", function () {
      this.fsAccessStub.yields(null);
      const actual = this.sut(this.context);

      return expect(actual).to.eventually.deep.equal(this.context);
    });
  });
});