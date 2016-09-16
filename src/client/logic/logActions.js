'use strict';

import * as LOGIC  from './LogicUtil';

/**
 * Log each dispatched action, using the following Log levels:
 *   - INSPECT: action type only
 *   - TRACE:   action content too
 */

const [logicName, logic] = LOGIC.promoteLogic('logActions', {

  type: '*',

  transform({getState, action}, next) {

    // log dispatched action
    const log = LOGIC.getActionLog(action, logicName);

    if (log.isTraceEnabled()) {
      log.trace(()=>   `Dispatched Action: ${FMT(action.type)} with content:\n${FMT(action)}`);
    }
    else {
      log.inspect(()=> `Dispatched Action: ${FMT(action.type)}`);
    }

    // continue processing
    next(action);
  },

});

export default logic;
