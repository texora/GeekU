'use strict';

// STILL HAVE BASIC enter/exit logs
// HMMMM ... can't get continuation-local-storage to work
//  - based on AsyncListener API
//  - continuation-local-storage
//  - come back to this (punt for now)
//    https://datahero.com/blog/2014/05/22/node-js-preserving-data-across-async-callbacks/
//    https://www.npmjs.com/package/continuation-local-storage
//    https://github.com/othiym23/node-continuation-local-storage
//    http://www.slideshare.net/isharabash/cls-and-asynclistener


import {createNamespace, getNamespace} from 'continuation-local-storage';
import shortid           from 'shortid';
import Log               from '../../shared/util/Log';

const logEnter = new Log('ProcessFlow.Enter');
const logExit  = new Log('ProcessFlow.Exit');

//console.log('??? namespace creating');
//const namespace = createNamespace('GeekU');
//console.log('???  namespace created');

/**
 * Express middleware that correlates all log entries to a specific request,
 * by including a unique transId in the log entry.
 *
 * NOTE: This middleware must be registered as early as possible in the process.
 *       ...
 *       app.use(correlateLogsToTransaction);
 *
 * @param {ServerRequest} req the Express request object
 * @param {ServerResponse} res the Express response object
 * @param {ExpressNext} next the Express next function
 *
 * @api public
 */
export default function correlateLogsToTransaction(req, res, next) {

    // cleanup when req/res is complete
    function afterResponse() {
      res.removeListener('finish', afterResponse);
      res.removeListener('close',  afterResponse);

      //***
      //*** TEAR-DOWN Logic
      //***

      // log probe of exiting request
      // ?? log filter: EnterExit ... Request Exiting
      // console.log('??? correlateLogsToTransaction TEAR DOWN: ');
      logExit.info(()=>`Exit Transaction: ${decodeURIComponent(req.originalUrl)}`);

      // clear the transId entry
      // ? _transIds.delete(req)
    }

    // register our tear-down event using ServerResponse native events
    res.on('finish', afterResponse);
    res.on('close', afterResponse);


    //***
    //*** SETUP Logic
    //***

    // define our unique transId for this req/res
    // ? _transIds.set(req, shortid.generate());
    // ??? GRRRR:  can't register log here, because it would be tied to the LAST req seen
    // ??? NO tid transId

    //const transId = shortid.generate();
    //console.log('??? here is my transId: ' + transId);

    // wrap the events from this req/res
    // ... ensure's event listeners will be within the scope of the namespace
    // ... required because EventEmitter isn't patched into the node core (like the AsyncListener API is)
    //namespace.bindEmitter(req);
    //namespace.bindEmitter(res);

    // allow all asynchronous functions to run in the scope of our namespace
//? namespace.bind( function() { // ??? try namespace.bind() of of outer function ... MESSES UP - NO exit msg
    //namespace.run( function() { // ??? tried namespace.bind() of inner function but NO luck
    //  console.log('??? namespace.set(transId): ' + transId);
    //  namespace.set('transId', transId); // store our transId on the namespace, making it available for all continuations
    //  console.log('??? see if I can get the value immediatly after: ' + namespace.get(transId), namespace); // ??? transId appears in namespace.active, BUT still returns undefined ... grrrr
    //  next(); // ??? is this a typo in the sample code?
    //});


    // log probe of entering request
    // ?? log filter: EnterExit ... Request Entering
    //console.log('??? correlateLogsToTransaction SETUP: ');
    //console.log('??? see if I can get the value immediatly after2: ' + namespace.get(transId), namespace); // ??? transId DOES NOT EVEN appear in namespace.active, and returns undefined ... grrrr
    logEnter.info(()=>`Enter Transaction: ${decodeURIComponent(req.originalUrl)}`);

    // continue express middleware
    next();
}

// ? /**
// ?  * Our unique transIds, keyed by the req.
// ?  *
// ?  * @api private
// ?  */
// ? const _transIds = new WeakMap() // KEY: req {object}, VAL: transId {String}
// ?? USAGE: const transId = _transIds.get(req)
// ??? GRRRR:  can't register log here, because we have NOT req to anchor on


// configure our logs to emit the transId
//Log.extra = function() {  // ??? tried namespace.bind() of function but NO diff
//
//  // ? const namespace2 = getNamespace('GeekU');
//
//  console.log('??? Logging namespace: ', namespace);
//
//  return ` TransId(${namespace.get('transId')})`;
//}
