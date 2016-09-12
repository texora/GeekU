// ??? THIS MODULE IS OBSOLETE ??? HOWEVER, there is logic that detects recursive errors that may need to be considered elsewhere
'use strict';

import handleUnexpectedError from '../../util/handleUnexpectedError';
import actionTypeAmplified   from '../../util/actionTypeAmplified';

import Log                   from '../../../shared/util/Log';

const log = new Log('middleware.errorHandler');

/**
 * Our central error handler middleware component, reporting uncaught
 * exceptions.
 *
 * NOTE: This middleware component is utilized for a JS run-time error,
 *       within the process of dispatching an action.
 *
 *       It is NOT activated within a catch block
 *         - of either a try/catch
 *           ... typically this would need to be invoked directly within the catch block
 *         - or an async promise .then()/.catch()
 *           ... typically this is CENTRALLY handled by a subsequent *.fail action
 *               being dispatched (which is centrally monitored in our reactive
 *               logic stream).
 */
const errorHandler = store => next => action => {
  
  try { // defer to original dispatch action logic
    log.inspect(()=>`ENTER ${log.filterName} for action: ${actionTypeAmplified(action)}`);
    return next(action);
  } 

  catch (err) { // central handler

    // detect recursive errors ... when the attempt to report the error, causes yet another error
    if (errInInProgress) {
      // here we do something as NON-INTRUSIVE as possible (i.e. an alert())
      // ... so as to NOT stimulate yet another error
      // ... NOTE: an exception at this level will be truely un-caught
      //           ... because we are outside the dispatch try/catch of this errorHandler
      const msg = 'A recursive error was detected in reporting a prior error';
      alert(`${msg}:\n\n    ${errInInProgress.clientMsg}\n    ${errInInProgress.message}\n\nIf this problem persists, please contact your tech support.`);
      log.error(()=>`${msg}, in action: ${actionTypeAmplified(action)} ... the prior error was logged above, the new error is:`, err);
    }

    // normal (happy-path) error handler
    else {
      errInInProgress = err;
      // report unexpected condition to user (logging details for tech reference)
      store.dispatch( handleUnexpectedError(err, `processing action: ${actionTypeAmplified(action)}`) );
    }
  }

  finally {
    errInInProgress = null;
    log.inspect(()=>`EXIT ${log.filterName} for action: ${actionTypeAmplified(action)}`);
  }
}

// used in detecting recursive errors
let errInInProgress = null;

export default errorHandler;
