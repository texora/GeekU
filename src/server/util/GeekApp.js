'use strict';

import express       from 'express';
import {MongoClient} from 'mongodb';
import HTTPStatus    from 'http-status';

/*--------------------------------------------------------------------------------

  The GeekUApp module provides various Express App extension points
  conforming to the GeekU standard, managing:
  
    - the promotion of Mongo DB connection pools
       * promoted via the Express App's req.geekU.db property
  
    - all output wrapped in the GeekU structured json document
       * promoted via the Express App's res.geekU.sendXxx() methods:
           + send(payload)
           + sendNotFound()
           + sendError(err, req)
       * conforming to the following format:
         {
           success:   <boolean>, // synopsis of success/failure
           status:    <int>,     // same as response.status
           statusMsg: <String>,  // human readable interpreation of status
           error: {              // error communication, when applicable (i.e. !success)
                                 // NOTE: GeekU considers a NOT Found (404) status as success=false with NO error object
             name:    <string>,     // the name classification for this error, ex: Error, ParseError, TypeError, etc.
             message: <string>,     // message for client consumption
             logId:   <string>      // server log identifier, when applicable (i.e. logging of unexpected condition)
           },
           data: { -or- [        // payload data structure, when applicable (can be an object or an array)
             ... specific to operation
           } -or- ]
         }

 --------------------------------------------------------------------------------*/


/**
 * GeekU Request Extension, promoted in the Express App's req.geekU
 * object.
 *
 * @param {ExpressRequest} req the Express Request object
 * @param {MongoDb} db the Mongo DB connection pool
 *
 * @api private
 */
class GeekUReq {
  constructor(req, db) {
    this.req = req;
    this.db  = db;
  }
}


/**
 * GeekU Response Extension, promoted in the Express App's res.geekU
 * object.
 *
 * @param {ExpressResponse} res the Express Response object
 *
 * @api private
 */
class GeekURes {
  constructor(res) {
    this.res = res;
  }

  /**
   * Send the supplied payload response
   *  - packaged in the standard GeekU structured json document
   *  - using an http status of 200 (OK)
   *
   * @param {json} payload the json payload content to send.
   *
   * @api public
   */
  send(payload) {
    const status = HTTPStatus.OK;
    this.res.status(status).send({
      success:   true,
      status:    status,
      statusMsg: HTTPStatus[status],
      data:      payload
    });
    console.log('DEBUG: ??? sending following payload: ', payload);
  }

  /**
   * Send a Not Found response (with NO payload)
   *  - packaged in the standard GeekU structured json document
   *  - using an http status of 404 (Not Found)
   *
   * @api public
   */
  sendNotFound() {
    const status = HTTPStatus.NOT_FOUND;
    this.res.status(status).send({
      success:   false,
      status:    status,
      statusMsg: HTTPStatus[status]
    });
    console.log('DEBUG: ??? sending 404 (Not Found)');
  }

  /**
   * Send the supplied error condition.
   *  - packaged in the standard GeekU structured json document
   *  - using the optional http status defined in err (default to 500 - Internal Server Error)
   *
   * NOTE: This method can be invoked directly by client code, or
   *       handled through our commonErrorHandler() (i.e. an uncaught
   *       exception) ... there really is no difference.
   *
   * @param {Error} err the Error object to be sent.
   * @param {ExpressRequest} req the optional Express request object (when
   * supplied, info is gleaned from this).
   *
   * @api public
   */
  sendError(err, req) {
    
    err.log(req);

    err.summarize(req);
    const errRes = {
      name:    err.summary.name,
      message: err.summary.clientMsg,
    };
    if (err.logId) {
      errRes.logId = err.logId;
    }
    
    this.res.status(err.summary.httpStatus).send({
      success:   false,
      status:    err.summary.httpStatus,
      statusMsg: HTTPStatus[err.summary.httpStatus],
      error:     errRes
    });
    console.log(`DEBUG: ??? sending ERROR: ${err.summary.clientMsg}`);
  }

}


/**
 * Create a running Express App, enhanced with GeekU extensions.
 * 
 *  - The MongoDB connection pool is managed, and the App is
 *    automatically started once the DB connections are available
 *    (defined asynchronously).
 * 
 *  - Each App req/res promotes a geekU property with various GeekU
 *    extensions (see GeekUReq/GeekURes above).
 *
 * @param {String} dbUrl the MongoDB URL to attach to
 * @param {int} appPort the Express server app port to listen
 *
 * @api public
 */
export function createRunningApp(dbUrl='mongodb://localhost:27017/GeekU', appPort=8080) {

  // create our express app
  const app = express();

  // obtain our MongoDB connection
  let _db = null;
  MongoClient.connect(dbUrl)
  .then( db => {

    // retain our db connection (to inject into each request)
    _db = db;

    // start our app, now that we have our db connection
    app.listen(appPort, () => {
      console.log('INFO: createRunningApp(): DB connection established, and app is listening on port: ' + appPort);
    });
    
  })
  .catch( err => { // MongoDB connection error
    // NOTE: This is an error condition prior to having a running Express app!
    //       As a result:
    //       - there is NO benefit in throwing this error
    //         ... because it is within our promise chain
    //         ... in other words, no one will interpret it
    //       - because our app is NOT started (i.e. the app.listen() above) 
    //         our process will simply run to completion and exit
    //       - THEREFORE, it is OUR responsibility to prominently log this error
    try { // try/catch: be extra cautious here, otherwise an exception in this logic is silently ignored
      let clientMsg = "Could not connect to our MongoDB";
      if (err.name === 'MongoError' &&
          err.message.includes('ECONNREFUSED')) {
            clientMsg += ' ... NOTE: Based on the internals of this error, we believe the MongoDB server is NOT running.'
      }
      err.setClientMsg(clientMsg);
      err.log();
      console.error('ERROR: Server cannot start - NO MongoDB Connection');

      // ??? temporarly keep going to run without DB
      console.error('INFO: HOWEVER, we are temporarly going to go forward with starting the server');
      app.listen(appPort, () => {
        console.log('INFO: createRunningApp(): DB connection established, and app is listening on port: ' + appPort);
      });
    }
    catch(e) {
      console.error('ERROR: Problem encountered in error processor of DIFFERENT problem (MongoDB connection issue):\n', e.stack);
    }
  });

  // promote (i.e. bind) our GeekU extensions to each req/resp
  app.use( (req, res, next) => {
    req.geekU = new GeekUReq(req, _db);
    res.geekU = new GeekURes(res);
    next();
  });

  // that's all folks :-)
  return app;
}


/**
 * The GeekU common error handler - handling BOTH "throw Error" and
 * Express "next(err)" semantics.
 * 
 * NOTE: This handler must be registered last to the Express App.
 *       ex: app.use( commonErrorHandler );
 *
 * @param {Error} err the Error object being handled
 * @param {ExpressRequest} req the Express request object
 * @param {ExpressResponse} res the Express response object
 * @param {ExpressNext} next the Express next function
 *
 * @api public
 */
export function commonErrorHandler(err, req, res, next) {
  // send response to client
  // ... handle programatic "api" clients
  //     NOTE: We trigger off of 'api' in the url, rather than req.xhr, 
  //           as the latter only handles client browser XMLHttpRequest
  //           NOT server http interaction.
  if (req.originalUrl.includes('api')) {
    res.geekU.sendError(err, req); // ... this will also log as needed
  }
  // ... handle non-programatic clients
  else {
    err.log(req);
    err.summarize(req);
    res.status(err.summary.httpStatus).send(clientMsg + (err.logId ? ` (LogId: ${err.logId})` : ''));
  }
}
