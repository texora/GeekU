'use strict';

import Log           from '../shared/util/Log';
import express       from 'express';
import bodyParser    from 'body-parser';
import path          from 'path';
import HTTPStatus    from 'http-status';
import {MongoClient} from 'mongodb';
import cors          from 'cors';
import courses       from './route/courses';
import students      from './route/students';
import selCrit       from './route/selCrit';
import logConfig     from '../shared/util/LogInteractiveConfigForServer';
import correlateLogsToTransaction from './util/correlateLogsToTransaction';

const log     = new Log('GeekU');
const logFlow = new Log('GeekU.ProcessFlow');

/*--------------------------------------------------------------------------------

  The GeekUApp module manages the Express App with all it's middleware
  registration.

  In addition to the standard middleware registrations, the following
  is also managed:
  
    - the promotion of Mongo DB connection pools
       * promoted via the Express App's req.geekU.db property
  
    - all output wrapped in the GeekU structured json document
       * using the following format (error/payload are mutually exclusive)
         {
           error: {              // error communication with app-specific content
                                 // NOTE: GeekU considers a NOT Found status (404) as an error WITH an error object
             name:    <string>,     // the name classification for this error, ex: Error, ParseError, TypeError, etc.
             message: <string>,     // message for client consumption
             cause:   <string>      // the root cause of the error [optional]
             url:     <string>      // the url in affect [optional]
             logId:   <string>      // server log identifier, when applicable (i.e. logging of unexpected condition)
           },
           payload: { -or- [     // payload data structure (can be an object or an array)
             ... specific to operation
           } -or- ]
         }
       * NOTE: Use your normal async web framework's promotion of http status and statusText and ok
       * NOTE: This structure is promoted via the Express App's res.geekU.sendXxx() methods:
           + send(payload)
           + sendNotFound()
           + sendError(err, req)

 --------------------------------------------------------------------------------*/

/**
 * Create a running Express App, enhanced with GeekU extensions.
 *
 * In addition to the standard middleware registrations, the following
 * is also managed:
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

  log.info(()=>'Starting GeekU Server.');

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
      log.info(()=>`DB connection established, and app is listening on port: ${appPort}`);
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
            clientMsg += '\n     NOTE: Based on the internals of this error, the MongoDB server may NOT be running.'
      }
      err.defineClientMsg(clientMsg);
      log.error(()=>'Server cannot start - NO MongoDB Connection ...', err);
    }
    catch(e) {
      log.error('Problem encountered in error processor of DIFFERENT problem (MongoDB connection issue):\n', e);
    }
  });

  // promote (i.e. bind) our GeekU extensions to each req/resp
  app.use( (req, res, next) => {
    req.geekU = new GeekUReq(req, _db);
    res.geekU = new GeekURes(res);
    next();
  });

  // provide transactional enter/exist log entries
  // -AND- 
  // correlate all log entries to a specific transaction (including things like transId, url, etc.)
  app.use(correlateLogsToTransaction);

  // handle Content-Type 'application/json' and 'text/plain' requests
  app.use(bodyParser.json());
  app.use(bodyParser.text());

  // serve our static assets
  const rootPath = path.join(__dirname, "../../public"); // LOG: rootPath: 'public' (sidebar: __dirname: 'src\server')
  app.use(express.static(rootPath));
  log.debug(()=>`Static resources serverd from rootPath: '${rootPath}' (sidebar: __dirname: '${__dirname}').`);
  
  // allow cross site requests (CORS)
  app.use(cors());
  
  // setup our various "API" modular routes
  app.use('/', courses);
  app.use('/', students);
  app.use('/', selCrit);
  // ... catch-all for /api
  app.get('/api/*', (req, res, next) => {
    const msg = `Unrecognized API request: ${decodeURIComponent(req.originalUrl)}`;
    // log.warn(()=>msg); // ... this log is a bit of an overkill ... will be logged by our error handler as INFO, but this is WARN
    next(new Error(msg).defineClientMsg(msg)
                       .defineCause(Error.Cause.RECOGNIZED_CLIENT_ERROR));
  });


  // allow our log filters to be interactivally configured
  app.use('/', logConfig);

  
  // send all other requests to index.html (so browserHistory in React Router works)
  // ... this catch-all route should be last
  app.get('*', function (req, res) {
    log.info(()=>'Servicing all other requests (catch-all)!');
  //res.sendFile(path.join(rootPath, 'index.html')); // TRY 1 ... TypeError: path must be absolute or specify root to res.sendFile
    res.sendFile('index.html', {root: rootPath});    // TRY 2 ... works with absolute resources (in index.html)
  });
  
  
  // register our common error handler
  // ... handles BOTH "throw Error" and Express "next(err)"
  // ... this registration must be last
  app.use( commonErrorHandler );

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
 * @param {ServerRequest} req the Express request object
 * @param {ServerResponse} res the Express response object
 * @param {ExpressNext} next the Express next function
 *
 * @api public
 */
function commonErrorHandler(err, req, res, next) {
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
    prepAndLogForSendError(err, req);
    res.status(err.httpStatus)
       .send(err.clientMsg + (err.logId ? ` (LogId: ${err.logId})` : ''));
  }
}

/**
 * Common routine to prep and log the supplied error for 
 * sending back to client.
 * 
 * @param {Error} err the Error object being handled
 * @param {ServerRequest} req the Express request object
 *
 * @api private
 */
function prepAndLogForSendError(err, req) {

  // insure err has httpStatus defined (default to INTERNAL_SERVER_ERROR)
  if (!err.httpStatus) {
    err.defineHttpStatus(HTTPStatus.INTERNAL_SERVER_ERROR);
  }

  // insure err has the URL defined
  if (!err.url) {
    err.defineUrl(req);
  }

  // log our error (depending on cause [e.g. if client condition] may NOT LOG)
  log.error(()=>'Following exception encountered ...', err);

}

/**
 * GeekU Request Extension, promoted in the Express App's req.geekU
 * object.
 *
 * @param {ServerRequest} req the Express Request object
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
 * @param {ServerResponse} res the Express Response object
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
    logFlow.info(()=>`Success - Sending Payload ${logFlow.isLevelEnabled(Log.TRACE) ? '' : ' (NOTE: To see payload enable Log: TRACE)'}`);
    logFlow.trace(()=>'here is the payload:\n', payload);
    const status = HTTPStatus.OK;
    this.res.status(status).send({
      payload: payload
    });
  }

  /**
   * Send a Not Found response (with NO payload)
   *  - packaged in the standard GeekU structured json document
   *  - using an http status of 404 (Not Found)
   *
   * @api public
   */
  sendNotFound() {
    logFlow.info(()=>'Not Found condition - Sending 404');
    const status = HTTPStatus.NOT_FOUND;
    this.res.status(status).send({
      error: {
        name:    'NotFound',
        message: 'Requested Resource was NOT Found',
      }
    });
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
   * @param {ServerRequest} req the optional Express request object (when
   * supplied, info is gleaned from this).
   *
   * @api public
   */
  sendError(err, req) {

    // log related ... either an INFO log (for client errors) -or- an ERROR log (for real problems)
    const isClientErr = (err.cause === Error.Cause.RECOGNIZED_CLIENT_ERROR);
    const logFn       = isClientErr ? logFlow.info.bind(logFlow) : log.error.bind(log);
    logFn(()=> {
      const clientQual    = isClientErr ? 'Client ' : 'UNEXPECTED ';
      const clarification = (isClientErr && Log.areClientErrorsExcluded())
              ? "\n      NOTE: To see Client Error details, re-configure Log: excludeClientErrors"
              : "\n      NOTE: Error details can be found in subsequent log entry";
      return `${clientQual}Error Condition: - Sending error: ${err.clientMsg}${clarification}`;
    });

    prepAndLogForSendError(err, req); // NOTE: log error details here!

    // package up the error and send it
    const errRes = {
      name:    err.name,
      message: err.clientMsg,
    };
    if (err.cause) { // cause is optional
      errRes.cause = err.cause;
    }
    if (err.url) { // url is optional
      errRes.url = err.url;
    }
    if (err.logId) { // err may NOT be logged if client condition
      errRes.logId = err.logId;
    }
    
    this.res.status(err.httpStatus)
            .send({
              error: errRes
            });
  }

}
