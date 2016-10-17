"use strict";

describe(__filename, function () {
  before(function () {
    this.sandbox = sinon.sandbox.create();
  });

  beforeEach(function () {
    this.fsCreateReadStreamStub = this.sandbox.stub();
    this.readStreamStub = {
      on: this.sandbox.stub(),
      pipe: this.sandbox.stub()
    };
    this.fsCreateReadStreamStub.returns(this.readStreamStub);

    this.parseStub = this.sandbox.stub();
    this.parseStub.returns("PARSER");

    this.sut = proxyquire("src/geocode-addresses-pipeline/steps/get-addresses-from-file", {
      "fs": {
        createReadStream: this.fsCreateReadStreamStub
      },
      "csv-parse": this.parseStub
    });

    this.context = {
      addressFilename: "addresses.csv"
    };
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  describe("csv parser", function () {
    it("should be created", function () {
      this.sut(this.context);

      expect(this.parseStub).to.have.been.calledWithExactly({columns: true}, sinon.match.func);
    });

    describe("on error", function () {
      it("should eventually reject with the error", function () {
        this.parseStub.yields("ERROR");
        const actual = this.sut(this.context);

        return expect(actual).to.eventually.be.rejectedWith("ERROR");
      });
    });

    describe("on success", function () {
      it("should eventually resolve with the addresses", function () {
        this.parseStub.yields(null, [{Address: "address 1"}, {Address: "address 2"}]);
        const actual = this.sut(this.context);

        return expect(actual.then(o => o.addresses)).to.eventually.deep.equal(["address 1", "address 2"]);
      });
    });
  });

  describe("address read stream", function () {
    it("should be created for the addresses file", function () {
      this.sut(this.context);

      this.fsCreateReadStreamStub.should.have.been.calledWithExactly("addresses.csv")
    });

    it("should listen for errors", function () {
      this.sut(this.context);

      this.readStreamStub.on.should.have.been.calledWithExactly("error", sinon.match.func)
    });

    it("should pipe data to the csv parser", function () {
      this.sut(this.context);

      this.readStreamStub.pipe.should.have.been.calledWithExactly("PARSER");
    });

    describe("on error", function () {
      it("should eventually reject with the error", function () {
        this.readStreamStub.on.yields("ERROR");
        const actual = this.sut(this.context);

        return expect(actual).to.eventually.be.rejectedWith("ERROR");
      });
    });
  });
});