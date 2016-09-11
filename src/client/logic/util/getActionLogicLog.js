'use strict'

import Log from '../../../shared/util/Log';


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
export default function getActionLogicLog(action, logicName) {

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
