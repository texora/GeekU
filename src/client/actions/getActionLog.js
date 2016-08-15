'use strict'

import Log from '../../shared/util/Log';


/**
 * Convenience utility that returns the cashed log instance
 * cooresponding to the supplied actionType.
 *
 * @param {string} actionType the action type that defines which log
 * to use.
 *
 * @return {Log} the log instance cooresponding to the supplied
 * actionType.
 */
export default function getActionLog(actionType) {
  let log = _actionLogCache[actionType];
  if (!log) { // ... lazily create on first usage
    log = _actionLogCache[actionType] = new Log(`actions.${actionType}`);
  }
  return log;
}

const _actionLogCache = {}; // Key: Action Type, Value: Log instance
