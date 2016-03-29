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


// set indicator that this error represents a client error that has
// been handled.
// ... return: self (i.e. receiving Error object)
// ... usage:
//      - re-throw existing err object, with clientError set
//          throw e.setClientError();
//      - throw new Error object, with clientError set
//          throw new Error("Internal Msg").setClientError();
if (!Error.prototype.setClientError) {
  Error.prototype.setClientError = function() {
    this.clientError = true;
    return this;
  };
}
