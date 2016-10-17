describe(__filename, function () {
  before(function () {
    this.sandbox = sinon.sandbox.create();
  });

  beforeEach(function () {
    this.filterStub = this.sandbox.stub();

    this.sut = proxyquire("src/geocode-addresses-pipeline/steps/filter-geocoded", {
      "./filter": this.filterStub
    });

    this.context = {
      geocoded: []
    };
  });

  afterEach(function () {
    this.sandbox.restore();
  });

  describe("when there are 0 geocoded items", function () {
    beforeEach(function () {
      this.actual = this.sut(this.context);
    });

    it("should execute the filter 0 times", function () {
      expect(this.filterStub).to.have.not.been.called;
    });

    it("should eventually resolve with the context", function () {
      return expect(this.actual).to.eventually.equal(this.context);
    });
  });

  describe("when there is 1 geocoded item", function () {
    beforeEach(function () {
      this.context.geocoded.push({});

      this.actual = this.sut(this.context);
    });

    it("should execute the filter 1 time", function () {
      expect(this.filterStub).to.have.been.calledOnce;
    });

    it("should eventually resolve with the context", function () {
      return expect(this.actual).to.eventually.equal(this.context);
    });
  });

  describe("when there are 2 geocoded items", function () {
    beforeEach(function () {
      this.context.geocoded.push({}, {});

      this.actual = this.sut(this.context);
    });

    it("should execute the filter 2 times", function () {
      expect(this.filterStub).to.have.been.calledTwice;
    });

    it("should eventually resolve with the context", function () {
      return expect(this.actual).to.eventually.equal(this.context);
    });
  });
});