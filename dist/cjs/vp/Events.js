"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

const R = require('ramda');

const {
  InvalidEventError
} = require('./Errors');
/**
 * An enum of event types.
 *
 * 'Process' refers to a validation process, triggered by a user requesting a credential.
 * UCA is a User Collectible Attribute, that is used to validate the user
 * @type {{UCA_STATUS_CHANGED: string, PROCESS_STATUS_CHANGED: string, PROCESS_UPDATED: string,
 * PROCESS_CREATED: string, UCA_RECEIVED: string}}
 */


const EventTypes = {
  // A new process has been created
  PROCESS_CREATED: 'Process Created',
  // The process status has been changed
  PROCESS_STATUS_CHANGED: 'Process Status Changed',
  // In a dynamic validation process plan, new UCA requests can be added ad-hoc to a running process
  PROCESS_UPDATED: 'Process Updated',
  // The user has responded with an answer to a UCA request
  UCA_RECEIVED: 'UCA Received',
  // A UCA status has been changed
  UCA_STATUS_CHANGED: 'UCA Status Changed',
  // A notification from an external task (either a completion event or a progress update)
  EXTERNAL_TASK_UPDATE: 'External Task Update',
  // An external service needs to be polled to check the status of the the external task
  EXTERNAL_TASK_POLL: 'External Task Poll'
};
const eventCreators = {}; // This throws an error if any of the expected fields in the
// event payload are undefined

const checkFieldsDefined = event => {
  const missingFields = Object.keys(event).filter(key => event[key] === undefined);

  if (missingFields.length) {
    throw new InvalidEventError(`Event is missing field(s) ${missingFields}. Event: ${JSON.stringify(event, null, 1)}`);
  }

  return event;
};

const addEventCreator = (type, payloadFn) => {
  const eventGeneratorFn = (...args) => {
    const payload = checkFieldsDefined(payloadFn(...args));
    return {
      type,
      payload
    };
  };

  eventCreators[type] = eventGeneratorFn;
};

addEventCreator(EventTypes.PROCESS_CREATED, ({
  id,
  credentialItemType
}) => ({
  id,
  credentialItemType
}));
addEventCreator(EventTypes.PROCESS_STATUS_CHANGED, ({
  id,
  oldStatus,
  newStatus
}) => ({
  id,
  oldStatus,
  newStatus
}));
addEventCreator(EventTypes.PROCESS_UPDATED, ({
  id,
  ucas
}) => ({
  id,
  ucas
}));
addEventCreator(EventTypes.UCA_RECEIVED, ({
  id,
  ucaId,
  value,
  applicantFirstName,
  applicantLastName
}) => ({
  id,
  ucaId,
  value,
  applicantFirstName: applicantFirstName || '',
  applicantLastName: applicantLastName || ''
}));
addEventCreator(EventTypes.UCA_STATUS_CHANGED, ({
  id,
  ucaId,
  oldStatus,
  newStatus
}) => ({
  id,
  ucaId,
  oldStatus,
  newStatus
})); // Task events can have taskId or taskName or both

const taskEventPayloadFn = event => {
  const {
    id,
    taskId,
    taskName
  } = event,
        data = _objectWithoutProperties(event, ["id", "taskId", "taskName"]);

  if (!taskId && !taskName) {
    throw new InvalidEventError(`Event is missing field taskId or taskName. Event: ${JSON.stringify(event, null, 1)}`);
  }

  return R.mergeAll([_objectSpread({
    id
  }, data), taskId ? {
    taskId
  } : {}, taskName ? {
    taskName
  } : {}]);
};

addEventCreator(EventTypes.EXTERNAL_TASK_UPDATE, taskEventPayloadFn);
addEventCreator(EventTypes.EXTERNAL_TASK_POLL, taskEventPayloadFn);

const create = (type, options) => eventCreators[type](options);

module.exports = {
  EventTypes,
  create
};