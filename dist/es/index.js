const CredentialRequest = require('./cr/CredentialRequest');

const CredentialRequestManager = require('./cr/CredentialRequestManager');

const ValidationProcess = require('./vp/ValidationProcess');

const ValidationErrors = require('./vp/ValidationErrors');

const Constants = require('./constants/ValidationConstants');

const Events = require('./vp/Events');

const handlers = require('./vp/Handler');

module.exports = {
  CredentialRequestManager,
  CredentialRequest,
  Constants,
  ValidationProcess,
  ValidationErrors,
  Events,
  ...handlers
};