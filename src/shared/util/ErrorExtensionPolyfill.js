'use strict';

// ***
// *** Provide value-added extension to the Error class.
// ***


if (!Error.prototype.defineClientMsg) { // key off of one of several extension points

  /**
   * Define a client-specific message, that is applicable for client
   * consumption:
   *  - both in meaning, 
   *  - and in sanitization (so as to not reveal any internal architecture).
   *
   * @param {String} clientMsg the client message to define
   *
   * @return {Error} self, supporting convenient Error method chaining.
   *
   * @api public
   */
  Error.prototype.defineClientMsg = function(clientMsg) {
    this.clientMsg = clientMsg;
    return this;
  };
  Error.prototype.clientMsg = "Unexpected Condition"; // prototype provides the default


  /**
   * Define an http status, allowing self to direct the status to be
   * defined to an http client.
   *
   * @param {int} httpStatus the http status to define.
   *
   * @return {Error} self, supporting convenient Error method chaining.
   *
   * @api public
   */
  Error.prototype.defineHttpStatus = function(httpStatus) {
    this.httpStatus = httpStatus;
    return this;
  };


  /**
   * Define an indicator as to the cause of this error ... used to apply
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
   * @return {Error} self, supporting convenient Error method chaining.
   *
   * @api public
   */
  Error.prototype.defineCause = function(cause) {
    this.cause = cause;
    return this;
  };

  Error.Cause = {
    UNEXPECTED_CONDITION:    'UNEXPECTED_CONDITION',
    RECOGNIZED_CLIENT_ERROR: 'RECOGNIZED_CLIENT_ERROR'
  };



  /**
   * Define a URL that is appropriate to this context.
   *
   * @param {ServerRequest} req the Express request object
   *
   * @return {Error} self, supporting convenient Error method chaining.
   *
   * @api public
   */
  Error.prototype.defineUrl = function(req) {
    this.url = decodeURIComponent(req.originalUrl);
    return this;
  };

}
