"use strict";

describe(__filename, function () {
  before(function () {
    this.sandbox = sinon.sandbox.create();
  });

  beforeEach(function () {
    this.throttleStub = {
      execute: this.sandbox.stub()
    };

    this.throttleFactoryStub = this.sandbox.stub();
    this.throttleFactoryStub.returns(this.throttleStub);

    this.getRequestHandlerStub = {
      on: this.sandbox.stub()
    };

    this.httpsStub = {
      get: this.sandbox.stub()
    };

    this.httpsStub.get.returns(this.getRequestHandlerStub);

    this.getGeocodeRequestOptionsStub = this.sandbox.stub();
    this.getGeocodeRequestOptionsStub.returns({});

    this.getResponseStub = {
      setEncoding: this.sandbox.stub(),
      on: this.sandbox.stub()
    };

    this.sut = proxyquire("src/helpers/geocode", {
      "https": this.httpsStub,
      "throttle-factory": this.throttleFactoryStub,
      "./get-geocode-request-options": this.getGeocodeRequestOptionsStub
    });

    this.address = "123 Drive NW";
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  it("should throttle requests", function () {
    this.sut(this.address);

    this.throttleStub.execute.should.have.been.calledWithExactly(sinon.match.func);
  });

  it("should execute a get request to geocode", function () {
    this.throttleStub.execute.yields();
    this.sut(this.address);

    this.getGeocodeRequestOptionsStub.should.have.been.calledWithExactly(this.address);
    this.httpsStub.get.should.have.been.calledWithExactly({}, sinon.match.func);
  });

  describe("on request error", function () {
    it("should eventually reject with the error", function () {
      this.throttleStub.execute.yields();
      this.getRequestHandlerStub.on.yields("ERROR");

      const actual = this.sut(this.address);

      return expect(actual).to.eventually.be.rejectedWith("ERROR");
    });
  });

  describe("when the geocode request has finished", function () {
    beforeEach(function () {
      this.throttleStub.execute.yields();
      this.httpsStub.get.yields(this.getResponseStub);
    });

    describe("the response", function () {
      it("should encode incoming data as `utf8`", function () {
        this.sut(this.address);

        this.getResponseStub.setEncoding.should.have.been.calledWithExactly("utf8");
      });

      it("should listen to data events", function () {
        this.sut(this.address);

        this.getResponseStub.on.should.have.been.calledWithExactly("data", sinon.match.func);
      });

      it("should listen to data end events", function () {
        this.sut(this.address);

        this.getResponseStub.on.should.have.been.calledWithExactly("end", sinon.match.func);
      });

      it("should listen to error events", function () {
        this.sut(this.address);

        this.getResponseStub.on.should.have.been.calledWithExactly("error", sinon.match.func);
      });

      describe("on success", function () {
        it("should append the data to the result and eventually resolve", function () {
          this.getResponseStub.on.withArgs("data", sinon.match.func).yields("{}");
          this.getResponseStub.on.withArgs("end", sinon.match.func).yields();

          const actual = this.sut(this.address);

          return expect(actual).to.eventually.deep.equal({});
        });
      });

      describe("on error", function () {
        it("should eventually reject with the error", function () {
          this.getResponseStub.on.withArgs("error", sinon.match.func).yields("ERROR");

          const actual = this.sut(this.address);

          return expect(actual).to.eventually.be.rejectedWith("ERROR");
        });
      });

      describe("when result is not valid JSON", function () {
        it("should reject with an error", function () {
          this.getResponseStub.on.withArgs("data", sinon.match.func).yields("foo");
          this.getResponseStub.on.withArgs("end", sinon.match.func).yieldsAsync();

          const actual = this.sut(this.address);

          return expect(actual).to.eventually.be.rejectedWith(SyntaxError);
        });
      });
    });
  });
});