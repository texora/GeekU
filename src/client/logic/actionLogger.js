'use strict';

import {createLogic}       from 'redux-logic';
import getActionLog        from '../actions/getActionLog';

//***
//*** logic point to log each dispatched action (INSPECT: action type, TRACE: action content too)
//***

const actionLogger = createLogic({

  type: '*',

  transform({getState, action}, next) {

    // log dispatched action
    const log = getActionLog(action.type);
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

export default actionLogger;
