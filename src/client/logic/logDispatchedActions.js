'use strict';

import promoteLogic      from './util/promoteLogic';
import getActionLogicLog from './util/getActionLogicLog';

/**
 * App logic which logs each dispatched action, using the following Log
 * levels:
 *   - INSPECT: action type only
 *   - TRACE:   action content too
 */

const [logicName, logic] = promoteLogic('logDispatchedActions', {

  type: '*',

  transform({getState, action}, next) {

    // log dispatched action
    const log = getActionLogicLog(action, logicName);

    if (log.isTraceEnabled()) {
      log.trace(()=>   `Dispatched Action: ${FMT(action.type)} with content: ${FMT(action)}`);
    }
    else {
      log.inspect(()=> `Dispatched Action: ${FMT(action.type)}`);
    }

    // continue processing
    next(action);
  },

});

export default logic;
