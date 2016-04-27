'use strict';

/**
 * Provide transactional enter/exist log entries
 *   -AND- 
 * Correlate all log entries to a specific transaction (including
 * things like transId, userId, url, etc.)
 *
 * Based on continuation-local-storage (cls) which is similar in concept
 * Java's thread-local, but is based on chains of Node-style callbacks
 * instead of threads.
 * see: 
 *  https://datahero.com/blog/2014/05/22/node-js-preserving-data-across-async-callbacks/
 *  https://www.npmjs.com/package/continuation-local-storage
 */

import * as cls from 'continuation-local-storage';
import shortid  from 'shortid';
import Log      from '../../shared/util/Log';

const logFlow = new Log('GeekU.ProcessFlow');

const namespace = cls.getNamespace('GeekU');

/**
 * Express middleware that captures enter/exit points ...
 *  - logging ProcessFlow
 *  - and establishing transactional information (transId, userId, url, etc.)
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
    logFlow.info(()=>'Exit Transaction');
  }

  // register our tear-down event using ServerResponse native events
  res.on('finish', afterResponse);
  res.on('close', afterResponse);


  //***
  //*** SETUP Logic
  //***

  const transId = shortid.generate();
  const userId  = 'L8TR';
  const url     = decodeURIComponent(req.originalUrl);

  // wrap the events from this req/res
  // ... ensure's event listeners will be within the scope of the namespace
  // ... required because EventEmitter isn't patched into the node core (like the AsyncListener API is)
  namespace.bindEmitter(req);
  namespace.bindEmitter(res);

  // allow all asynchronous functions to run in the scope of our namespace
  namespace.run( function() {

    // store our transaction information our namespace, making it available for all continuations
    namespace.set('transId', transId);
    namespace.set('userId',  userId);
    namespace.set('url',     url);

    // log probe of entering request
    logFlow.info(()=>'Enter Transaction');

    // continue express middleware
    next();
  });
}


/**
 * Inject transaction information (e.g. transId, userId, url, etc.) to all log entries.
 * 
 * Simply piggy back on the end of our filterName.
 * ... ex: 
 *     FLOW  2016-04-26 13:02:44 GeekU.ProcessFlow Trans(transId: EyrPhqOgZ, userId: L8TR, url: /api/courses/CS-1132)):
 *           Enter Transaction
 *
 */
Log.config({
  format: {
    fmtFilter: function(filterName) {
      const transId   = namespace.get('transId');
      const transInfo = transId ? `Trans(transId: ${transId}, userId: ${namespace.get('userId')}, url: ${namespace.get('url')})`
                                : `Trans(none)`;
      return `${filterName} ${transInfo})`;
    }
  }
});
