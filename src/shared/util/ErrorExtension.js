'use strict';

import HTTPStatus from 'http-status';
import shortid    from 'shortid';


// ***
// *** provide extension to Error object, supporting some app-level features
// ***


/**
 * Set a client-specific message, that is applicable for client
 * consumption:
 *  - both in meaning, 
 *  - and is sanitized (so as to not reveal any internal architecture).
 *
 * @param {String} clientMsg the client message to set
 *
 * @return {Error} self, supporting Error method chaining.
 *
 * @api public
 */
if (!Error.prototype.setClientMsg) {
  Error.prototype.setClientMsg = function(clientMsg) {
    this.clientMsg = clientMsg;
    return this;
  };
}


/**
 * Set an http status, allowing self to direct the status to be
 * defined to an http client.
 *
 * @param {int} httpStatus the http status to set.
 *
 * @return {Error} self, supporting Error method chaining.
 *
 * @api public
 */
if (!Error.prototype.setHttpStatus) {
  Error.prototype.setHttpStatus = function(httpStatus) {
    this.httpStatus = httpStatus;
    return this;
  };
}


/**
 * Set an indicator as to the cause of this error ... used to apply
 * various heuristics, such as whether logging is necessary.
 *
 * The following indicators are available:
 *   Error.Cause {
 *     UNEXPECTED_CONDITION        [default]
 *     RECOGNIZED_CLIENT_ERROR
 *   }
 *
 * @param {String} cause one of Error.Cause.
 *
 * @return {Error} self, supporting Error method chaining.
 *
 * @api public
 */
if (!Error.prototype.setCause) {
  Error.prototype.setCause = function(cause) {
    this.cause = cause;
    return this;
  };

  Error.Cause = {
    UNEXPECTED_CONDITION:    'UNEXPECTED_CONDITION',
    RECOGNIZED_CLIENT_ERROR: 'RECOGNIZED_CLIENT_ERROR'
  };

}


/**
 * Interpret self's error condition, summarizing in self as follows:
 *
 *   self.summary {
 *     name:       {String} the name classification for this error, ex: Error, ParseError, TypeError, etc.
 *     httpStatus: {int}    the httpStatus contained in this Error
 *     clientMsg:  {String} the client msg, sanitized to not reveal internal details
 *     message:    {String} the message containe in this Error
 *     url:        {String} the decoded request url (only when req param supplied)
 *   }
 *
 * @param {ExpressRequest} req an optional Express request object
 * (when supplied, info is gleaned from this).
 *
 * @api public
 */
if (!Error.prototype.summarize) {
  Error.prototype.summarize = function(req) {

    // no-op if we have already been summarized
    if (this.summary) {
      return;
    }

    this.summary = {
      name:       this.name       || "Error",
      httpStatus: this.httpStatus || HTTPStatus.INTERNAL_SERVER_ERROR,
      clientMsg:  this.clientMsg  || "Unexpected Condition",
      message:    this.message    || "Unknown"
    };
    
    if (req) {
      this.summary.url = decodeURIComponent(req.originalUrl);
    }
  };

}


/**
 * Log self applying a consistent and standard format.
 *
 * The error is conditionally logged, no-oping when:
 *  - the err is a recognized client condition, or
 *  - the err has already been logged
 *
 * @param {ExpressRequest} req an optional Express request object (when
 * supplied, info is gleaned from this).
 *
 * @api public
 */
if (!Error.prototype.log) {
  Error.prototype.log = function(req) {

    this.summarize(req);

    // no logging is required when ...
    if (this.cause === Error.Cause.RECOGNIZED_CLIENT_ERROR || // the err is a recognized client condition, or
        this.logId)                                           // the err has already been logged
      return;
    
    this.logId = shortid.generate();
    
    // log problem in our console
    console.error(`
ERROR: The following exception was encountered ...
  Name:       ${this.summary.name}
  Status:     ${this.summary.httpStatus}
  StatusMsg:  ${HTTPStatus[this.summary.httpStatus]}
  Client Msg: ${this.summary.clientMsg}
  Message:    ${this.summary.message}
  URL:        ${this.summary.url}
  LogId:      ${this.logId}
  Stack Trace:
   ${this.stack}
`);

  };

}

