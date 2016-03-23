'use strict';

// ***
// *** provide extension to Error object, supporting some new properties
// ***

// allow clientMsg to be defined on an existing Error instance
// ... return: self (i.e. receiving Error object)
// ... usage:
//      - re-throw existing err object, with clientMsg defined
//          throw e.setClientMsg("sanitized msg");
//      - throw new Error object, with clientMsg defined
//          throw new Error("Internal Msg").setClientMsg("sanitized msg");
if (!Error.prototype.setClientMsg) {
  Error.prototype.setClientMsg = function(clientMsg) {
    this.clientMsg = clientMsg;
    return this;
  };
}

// allow status to be defined on an existing Error instance
// ... return: self (i.e. receiving Error object)
// ... usage:
//      - re-throw existing err object, with status defined
//          throw e.setStatus("sanitized msg");
//      - throw new Error object, with status defined
//          throw new Error("Internal Msg").setStatus("sanitized msg");
if (!Error.prototype.setStatus) {
  Error.prototype.setStatus = function(status) {
    this.status = status;
    return this;
  };
}
