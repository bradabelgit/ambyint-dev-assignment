const chai = require("chai");
const sinon = require("sinon");
const sinonChai = require("sinon-chai");
const proxyquire = require("proxyquire");
const chaiAsPromised = require("chai-as-promised");
const bluebird = require("bluebird");

require('sinon-as-promised');

chai.use(sinonChai);
chai.use(chaiAsPromised);
chai.should();

global.Promise = bluebird;
global.expect = chai.expect;
global.sinon = sinon;
global.proxyquire = proxyquire;
