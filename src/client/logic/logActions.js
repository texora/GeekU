'use strict';

import createNamedLogic, * as LOGIC  from './util/createNamedLogic';
import {AT}  from '../actions';


/**
 * Log each dispatched action, using the following Log levels:
 *   - TRACE:   see dispatched actions
 *   - VERBOSE: see dispatched actions INCLUDING action content (CAUTION: action content can be BIG)
 */
export default createNamedLogic('logActions', {

  type: '*',

  transform({getState, action, log}, next) {

    // Logging Note: We bypass logging of hover actions because they are just too prolific (filling up our logs)
    //               ... they are debounced, so minimal number of these actions actually make it to dispatch
    //                   (visable in redux-dev-tools)
    const logAction = action.type !== AT.hoverItem.valueOf();

    // log dispatched action
    if (logAction) {
      if (log.isVerboseEnabled()) {
        log.verbose(()=> `Dispatched Action: ${FMT(action.type)} with content:\n${FMT(action)}`);
      }
      else {
        log.trace(()=>   `Dispatched Action: ${FMT(action.type)}`);
      }
    }

    // continue processing
    next(action);
  },

});
