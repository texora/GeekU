'use strict';

import {createLogic}       from 'redux-logic';
import getActionLog        from '../actions/getActionLog';
import actionTypeAmplified from '../util/actionTypeAmplified';

//***
//*** logic point to log each dispatched action (INSPECT: action type, TRACE: action content too)
//***

const actionLogger = createLogic({

  type: '*',

  transform({getState, action}, next) {

    // log dispatched action
    const log = getActionLog(action.type);
    if (log.isTraceEnabled()) {
      log.trace(()=> `Dispatched Action: ${actionTypeAmplified(action)}`, action);
    }
    else {
      log.inspect(()=> `Dispatched Action: ${actionTypeAmplified(action)} (re-config to TRACE to see action details [CAUTION: can be LARGE])`);
    }

    // continue processing
    next(action);
  },

});

export default actionLogger;
