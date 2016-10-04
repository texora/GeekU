'use strict';

import * as LOGIC  from './LogicUtil';

/**
 * Log each dispatched action, using the following Log levels:
 *   - TRACE:   see dispatched actions
 *   - VERBOSE: see dispatched actions INCLUDING action content (CAUTION: action content can be BIG)
 */

const [logicName, logic] = LOGIC.promoteLogic('logActions', {

  type: '*',

  transform({getState, action}, next) {

    // log dispatched action
    const log = LOGIC.getActionLog(action, logicName);

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

export default logic;
