"use strict";

describe(__filename, function () {
  before(function () {
    this.sandbox = sinon.sandbox.create();
  });

  beforeEach(function () {
    this.fsStub = {
      writeFile: this.sandbox.stub()
    };

    this.jsonFormatStub = this.sandbox.stub();
    this.jsonFormatStub.returns("{}");

    this.sut = proxyquire("src/geocode-addresses-pipeline/steps/save-results-to-file", {
      "fs": this.fsStub,
      "json-format": this.jsonFormatStub
    });

    this.context = {
      results: "RESULTS",
      resultsFilename: "results.json"
    };
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it("should write formatted json to the file 'results.json'", function () {
    this.sut(this.context);

    this.jsonFormatStub.should.have.been.calledWithExactly("RESULTS");
    this.fsStub.writeFile.should.have.been.calledWithExactly("results.json", "{}", sinon.match.func);
  });

  describe("when the file has been written", function () {
    describe("on error", function () {
      it("should eventually reject with the error", function () {
        this.fsStub.writeFile.yields("ERROR");
        const actual = this.sut(this.context);

        return expect(actual).to.eventually.be.rejectedWith("ERROR");
      });
    });

    describe("on success", function () {
      it("should eventually resolve with the context", function () {
        this.fsStub.writeFile.yields();
        const actual = this.sut(this.context);

        return expect(actual).to.eventually.be.fulfilled;
      });
    });
  });
});