'use strict'

import {createLogic} from 'redux-logic';
import Log           from '../../shared/util/Log';

//***
//*** various logic utilities/constants
//***


/**
 * Convenience utility that consolidates all logic component
 * definition in one concise return ... streamlining logicName usage.
 *
 * @param {string} logicName this component's logic name (injected in
 * logic-based logging probes ... see: getActionLogicLog()).
 *
 * @param {Logic} logicDef the logic definition ... supplied to
 * redux-logic createLogic().
 *
 * @return {Array} a convenience object consolidating two pieces
 * of information: [ logicName, logic ]
 */
export function promoteLogic(logicName, logicDef) {
  // create the logic component, promoting our consolidated information
  return [ logicName, createLogic(logicDef) ];
}


/**
 * Return a cached log instance filtered by an action type that is
 * specific to a named logic component (identifying the logic
 * component in all emitted probes).
 *
 * @param {Action} action the action object of interest.
 * @param {string} logicName the name of the logic component.
 *
 * @return {Log} the log instance cooresponding to the supplied
 * action.type/logicName combination.
 */
export function getActionLog(action, logicName) {

  const key = action.type + '_' + logicName;

  // pull from cache when seen before
  let log = _cache[key];

  // lazily create/cache on first usage
  if (!log) {
    log = _cache[key] = new Log(`actions.${action.type}`);

    // enhance log.log() to emit logicName in msgFn param
    const priorLogMeth = log.log.bind(log);
    log.log = (level, msgFn, obj) => {
      const enhancedMsgFn = () => `Logic: ${logicName} ... ${msgFn()}`;
      priorLogMeth(level, enhancedMsgFn, obj);
    }
  }
  return log;
}

// cached log entries
const _cache = {}; // Key: '{action.type}_{logicName}', Value: Log instance


/**
 * Constant to allow multiple dispatches with a single logic.process().
 */
export const allowMore = { allowMore: true };
