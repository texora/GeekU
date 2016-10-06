'use strict'

import {createLogic}  from 'redux-logic';
import Log            from '../../../shared/util/Log';
import {AT}           from '../../actions';


/**
 * Value-added redux-logic createLogic() function that:
 *   a) associates a name to each logic module, and 
 *   b) automates logging characteristics:
 *        - a special log is injected into the redux-logic
 *          dependencies that is filtered by the action type and is
 *          specific to a named logic component (identifying the logic
 *          component in all emitted probes)
 *        - enter/exit logging probes are added to each logic function
 *
 * @param {string} logicName this component's logic name (injected in
 * logic-based logging probes).
 *
 * @param {Logic-Def} logicDef the logic definition ... supplied to
 * redux-logic createLogic().
 *
 * @return {Logic} the enhanced redux-logic module.
 */
export default function createNamedLogic(logicName, logicDef) {

  // inject value-added aspects to the supplied logicDef
  // ... enhance well-know functions: validate()/transform()/process()
  for (const funcName of ['validate', 'transform', 'process']) {

    const priorFunc = logicDef[funcName];

    // enhance/override any of the supplied functions
    if (priorFunc) {
      logicDef[funcName] = function(...args) {

        const depObj = args[0];
        const action = depObj.action;

        // inject our special log into redux-logic dependencies
        // ... NOTE: because our log is based on action, we have to
        //           inject it at run-time (through this monkey-patch),
        //           rather than the standard redux-logic dependency injection
        const log = getActionLog(action, logicName);
        depObj.log = log;


        // restrict enter/exit loggind probes for selected logic modules and action types
        const logEnterExit = logicName   !== 'logActions' &&         // logAction  enter/exit logic module is a higher-order process
                             action.type !== AT.hoverItem.valueOf(); // hover actions are just too prolific

        // invoke the original function, wrapped with enter/exit logging probes
        if (logEnterExit)   log.verbose(()=> `ENTER logic function: ${logicName}.${funcName}()`);
        priorFunc(...args);
        if (logEnterExit)   log.verbose(()=> `EXIT logic function: ${logicName}.${funcName}()`);
      };
    }
  }

  // create/expose the redux-logic component with the value-added aspects defined above
  return createLogic(logicDef);
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
 *
 * @private
 */
function getActionLog(action, logicName) {

  const key = action.type + '_' + logicName;

  // pull from cache when seen before
  let log = _cache[key];

  // lazily create/cache on first usage
  if (!log) {
    log = _cache[key] = new Log(`actions.${action.type}`);

    // enhance log.log() to emit logicName in msgFn param
    const priorLogMeth = log.log.bind(log);
    log.log = (level, msgFn, obj) => {
      const enhancedMsgFn = () => `${msgFn()} (logic: ${logicName})`;
      priorLogMeth(level, enhancedMsgFn, obj);
    }
  }
  return log;
}

// cached log entries
const _cache = {}; // Key: '{action.type}_{logicName}', Value: Log instance


//***
//*** Various Constants
//***

/**
 * Constant to allow multiple dispatches with a single logic.process().
 */
export const allowMore = { allowMore: true };
