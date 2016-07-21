'use strict';

import {BATCH}             from 'redux-batched-actions';
import {getActionLog}      from '../../state/actions';
import actionTypeAmplified from '../../state/actionTypeAmplified';

import Log                 from '../../../shared/util/Log';

const log = new Log('middleware.actionLogger');

/**
 * Our central action logger middleware component, 
 * emitting all action probes.
 */
const actionLogger = store => next => action => {
  try {
    log.follow(()=>`ENTER ${log.filterName} for action: ${actionTypeAmplified(action)}`);

    // log "ENTER" probe
    // NOTE: We have special logic to support batched sub-actions 
    //       ... because action batching occurs at the reducer level (NOT the dispatching level),
    //           we do NOT see the sub-action dispatch log entries
    //           WITHOUT this enhancement
    function logEnter(action, indx, arr, batched=true) {
      const actionIsFunct = typeof action === 'function';
      const actionIsObj   = !actionIsFunct;
      const log           = getActionLog(action.type);
      
      log.follow(()=> {
        const clarification = !log.isTraceEnabled() && actionIsObj
                                ? '... NOTE: reconfigure log to TRACE to see action details (CAUTION: actions with payload can be LARGE)'
                                : '';
        return `ENTER${batched ? ' [BATCHED] ' : ' '}action: ${actionTypeAmplified(action)} ${clarification}`
      });
      if (actionIsObj) {
        log.trace(()=>'action details:\n', action);
      }
    }
    logEnter(action, null, null, false);
    if (action.type == BATCH) { // ... use == because our types are String objects ... NOT string built-ins
      action.payload.forEach(logEnter);
    }
    
    // defer to original dispatch action logic
    const result = next(action);
    
    // log "EXIT" probe
    // NOTE: We have special logic to support batched sub-actions 
    //       ... see NOTE in: log "ENTER" probe (above)
    function logExit(action, indx, arr, batched=true) {
      const log = getActionLog(action.type);
      // TODO: we could log store.getState(), but that is WAY TOO MUCH ... CONSIDER DIFF LOGIC
      //       ... simply retain beforeState (above) and afterState here
      log.follow(()=>`EXIT${batched ? ' [BATCHED] ' : ' '}action: ${actionTypeAmplified(action)}`); 
    }
    if (action.type == BATCH) { // ... use == because our types are String objects ... NOT string built-ins
      action.payload.concat().reverse().forEach(logExit);
    }
    logExit(action, null, null, false);
    
    // that's all folks
    return result;
  }
  finally {
    log.follow(()=>`EXIT ${log.filterName} for action: ${actionTypeAmplified(action)}`);
  }
}

export default actionLogger;
