'use strict';

import createNamedLogic, * as LOGIC  from './util/createNamedLogic';


/**
 * Log each dispatched action, using the following Log levels:
 *   - TRACE:   see dispatched actions
 *   - VERBOSE: see dispatched actions INCLUDING action content (CAUTION: action content can be BIG)
 */
export default createNamedLogic('logActions', {

  type: '*',

  transform({getState, action, log}, next) {

    // log dispatched action
    if (log.isVerboseEnabled()) {
      log.verbose(()=> `Dispatched Action: ${FMT(action.type)} with content:\n${FMT(action)}`);
    }
    else {
      log.trace(()=>   `Dispatched Action: ${FMT(action.type)}`);
    }

    // continue processing
    next(action);
  },

});
