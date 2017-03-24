import AstxReduxUtil from 'astx-redux-util';
import Log           from '../../shared/util/Log';
import assert        from 'assert';

// value-added reducerHash.withLogging()
// ... a wrapper TO reducerHash() - a higher-order function (HOF)
//     - WITH an additional parameter:
//        * log: {Log} the log to use in emitting reducer-based probes
//                     NOTE: the log's filterName is assumed to be the state element name
AstxReduxUtil.reducerHash.withLogging = (log, ...reducerHashArgs) => {

  // validate the supplied log parameter
  assert(log.reducerProbe,
         `AstxReduxUtil.reducerHash.withLogging() requires a log parameter (that contains a log.reducerProbe() method.`);

  // invoke the original reducerHash() ... an HOF: retaining it's reducerFn
  const reducerFn = AstxReduxUtil.reducerHash(...reducerHashArgs);

  // expose actionHandlers ... used in additional logging characteristics
  const actionHandlers = reducerHashArgs[0];

  // wrap the resultant reducerFn to apply our value-added logging
  return (...reducerArgs) => {

    const state  = reducerArgs[0];
    const action = reducerArgs[1];

    // invoke the original reducerFn()
    // NOTE1: The es6 rest syntax accommodates astx-redux-util's
    //        additional "originalReducerState" argument
    // NOTE2: Result (via this extension) is expected to be:
    //        [nextState, logMsgFn|null]
    const reducerResult   = reducerFn(...reducerArgs);
    const handlerInvolved = actionHandlers[action.type] ? true : false;
    const [nextState, logMsgFn] = handlerInvolved
                                   ? reducerResult
                                   : [reducerResult, null]; // pass-throughs return the same state (i.e. NOT wrapped in array)

    // emit our standardized reducer-based logging probe
    log.reducerProbe(action, state!==nextState, logMsgFn);

    return nextState;
  };

};


//***
//*** ALSO, polyfill our Log utility with STANDARIZED reducer-based probes
//***

/**
 * Emit a reducer-based logging probe, standardizing both message format
 * -and- logging levels.
 *
 * The probe's logging level is dynamically determined, based on
 * whether the state has changed, and/or whether a reducer-specific
 * message is to be communicated. 
 * 
 * The advantage of this dynamic is it allows logging filters to be
 * configured at a very high-level (i.e. for ALL reducers) with minimal
 * output (i.e. the INSPECT level will focus exclusively on reducers that
 * have changed a state element).
 *
 * Ultimatly, this is made possible because of the central role 
 * AstxReduxUtil.reducerHash() plays in the reduction process.
 *
 * Logging levels used are:
 * 
 *   INSPECT: monitor state changes only
 *   DEBUG:   includes explicit reducer logic regardless of state changes
 *            ... i.e. monitor WHICH reducer reasoned about an action
 *   TRACE:   includes ALL reducer enter/exit points 
 *            (NOT much value, shows ALL state reducer)
 * 
 * NOTE: For purposes of the emitted probe, the log filterName
 *       is assumed to be the name of the state tree.
 * 
 * @param {Object}  action         the standard redux action involved
 * @param {boolean} stateChanged   indicator as to whether the app state element has changed
 * @param {string}  [reducerMsgFn] an optional "clarifying" message from app-specific reducer
 */
Log.prototype.reducerProbe = function(action, stateChanged, reducerMsgFn) {

  const logLevel = (stateChanged)
                     ? Log.INSPECT   // state change
                     : (reducerMsgFn)
                        ? Log.DEBUG  // no state change, but app-specific logic
                        : Log.TRACE; // no state change, and no app-logic

  // emit the "dynamic" logging probe
  this.log(logLevel, ()=> {
    const stateChangedMsg = stateChanged
                             ? 'STATE CHANGED'
                             : 'STATE UN-CHANGED';
    const reducerMsg      = reducerMsgFn
                             ? `,  Reducer Msg: ${reducerMsgFn()}`
                             : '';
    // ex: STATE CHANGED: appState.editSelCrit.extra.fieldOptions,  Action: 'selCrit.edit',  Reducer Msg: set fieldOptions from action
    return `${stateChangedMsg}: ${this.filterName},  Action: '${action.type}'${reducerMsg}`;
  });



};
