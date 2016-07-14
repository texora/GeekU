'use strict';

import Log            from '../../shared/util/Log';
import {getActionLog} from '../state/actions';

import * as Redux                            from 'redux';
import {enableBatching, batchActions, BATCH} from 'redux-batched-actions';
import thunk                                 from 'redux-thunk';
import appState                              from '../state/appState';
import handleUnexpectedError                 from '../util/handleUnexpectedError';

const log = new Log('startup.createAppStore');

/**
 * Create the GeekU redux appStore, registered with the required 
 * middleware components.
 *
 * NOTE: Our appStore is promoted as a 'creator' function, rather than
 *       a singleton pattern, to avoid the singleton anti-pattern.
 *       In this case, a singleton would:
 *        - make it harder to test
 *        - make it impossible to add server rendering of the app
 *          (which requires a separate store per request).
 *
 * @return {Redux Store} the GeekU redux appStore.
 */
export default function createAppStore() {

  log.info(()=> 'creating our GeekU Redux appStore');
  
  // locate the optional Redux DevTools Chrome Extension
  // ... if installed in this browser instance
  const NO_EXTENSION = p=>p;
  const reduxDevToolsChromeExtension = window.devToolsExtension ? window.devToolsExtension() : NO_EXTENSION;
  log.info(()=> `the optional Redux DevTools Chrome Extension ${reduxDevToolsChromeExtension !== NO_EXTENSION ? 'IS' : 'IS NOT'} PRESENT!`);
  

  // internal utility that emits human readable info detailing action types in a variety of scenerios
  // ... used in our middleware logging
  function actionTypeMsg(action) {
    let msg = 'Type';
    if (Array.isArray(action)) {
      msg += '(array): [';
      for (const subAction of action) {
        msg += actionTypeMsg(subAction);
      }
      msg += ']';
    }
    else if (typeof action === 'function') {
      msg += `(thunk): '${action.type}' `; // ... in GeekU, even our thunks (functions) have a type attribute
    }
    else if (action.type == BATCH) { // ... use == because our types are String objects ... NOT string built-ins
      msg += `(${BATCH}): [`;
      for (const subAction of action.payload) {
        msg += actionTypeMsg(subAction);
      }
      msg += ']';
    }
    else { // an action object
      msg += `(object): '${action.type}' `;
    }
    return msg;
  }

  
  // define our central error handler for uncaught exceptions
  let   errInInProgress = null;  // ... used to detect recursive errors (see below)
  const errorHandler = store => next => action => {
    
    const log = new Log('middleware.errorHandler');
  
    try { // defer to original dispatch action logic
      log.follow(()=>`ENTER ${log.filterName} for action: ${actionTypeMsg(action)}`);
      return next(action);
    } 
    catch (err) { // central handler

      // detect recursive errors ... when the attempt to report the error, causes yet another error
      if (errInInProgress) {
        // here we do something as NON-INTRUSIVE as possible (i.e. an alert())
        // ... so as to NOT stimulate yet another error
        // ... NOTE: an exception at this level will be truely un-caught
        //           ... because we are outside the dispatch try/catch of this errorHandler
        const msg = 'A recursive error was detected in reporting a prior error';
        alert(`${msg}:\n\n    ${errInInProgress.clientMsg}\n    ${errInInProgress.message}\n\nIf this problem persists, please contact your tech support.`);
        log.error(()=>`${msg}, in action: ${action.type} ... the prior error was logged above, the new error is:`, err);
      }
      // normal (happy-path) error handler
      else {
        errInInProgress = err;
        // report unexpected condition to user (logging details for tech reference)
        store.dispatch( handleUnexpectedError(err, `processing action: ${action.type}`) );
      }

    }
    finally {
      errInInProgress = null;
      log.follow(()=>`EXIT ${log.filterName} for action: ${actionTypeMsg(action)}`);

    }
  }
  
  // define our thunk/batch handler ... supporting BOTH thunks and action arrays (containing both objects and thunks)
  const thunkBatchHandler = ({dispatch, getState}) => next => action => {
    const log = new Log('middleware.thunkBatchHandler');
    try {
      log.follow(()=>`ENTER ${log.filterName} for action: ${actionTypeMsg(action)}`);

      //***
      //*** Phase I: Collect Phase - collect all action objects (resolving thunks into action objects)
      //***

      let phase = 'collectActions'; // in effect during the direct execution of thunks

      // our collection of ALL action object(s)
      // ... thunks are resolved by collecting any optional actions they dispatch within their direct execution (via our wrappedDispatch)
      const allActionObjects = [];

      // maintain any thunk return value(s)
      // ... TODO: this return value has NOT been used/tested - it may need work (if we decide to utilize thunk composition)
      const thunkReturnVals    = []; // ex: promise(s) returned from thunk(s)
      function evalThunkReturnVals() {
        switch (thunkReturnVals.length) {
          case 0:  return undefined;
          case 1:  return thunkReturnVals[0];
          default: return thunkReturnVals;
        }
      }

      // utility to add supplied action (an object, or an array, or a thunk), resolving into action object
      function addActionObject(action) {

        // for action thunks, we directly execute the thunk
        // ... this is similar to redux-thunk middleware
        //     - EXCEPT we collect action objects in allActionObjects
        //       ... via wrappedDispatch (in our 'collectActions' phase)
        //       ... KEY: supporting our batching philosophy
        //     - please refer to the redux-thunk source: 
        //       ... https://github.com/gaearon/redux-thunk/blob/master/src/index.js
        if (typeof action === 'function') {
          const thunkReturnVal = action(wrappedDispatch, getState);
          if (thunkReturnVal) {
            thunkReturnVals.push(thunkReturnVal);
          }
        }

        // for action arrays, we resolve each action (which could be an action object, or a thunk)
        else if (Array.isArray(action)) {
          action.forEach( (action) => {
            addActionObject(action);
          });
        }

        // for action objects, simply collect them
        else {
          allActionObjects.push(action);
        }
      }

      // here is our wrapped dispatch object that operates differently within our two phases
      function wrappedDispatch(otherAction) {

        // within our 'collectActions' phase, we merely collect actions from any thunk execution
        if (phase === 'collectActions') {
          addActionObject(otherAction);
        }

        // within our execution phase, we simply pass-through to the real dispatch
        // ... this occurs once all thunks have initially executed
        //     ex: a future execution of a thunk's inner callback
        else {
          dispatch(otherAction);
        }
      }

      // bootstrap our process by adding the initial action supplied to our middleware
      addActionObject(action);


      //***
      //*** Phase II: Execution Phase - all actions have been resolved as action objects (i.e. NOT thunks)
      //***

      phase = 'executeActions'; // in effect during a future execution of a thunk's inner callback

      switch (allActionObjects.length) {

        case 0:  // NO action objects to dispatch (ex: thunk with delayed dispatch)
          log.debug(()=>'NO action object to dispatch (ex: thunk with delayed dispatch)');
          return evalThunkReturnVals();

        case 1:  // A single action object to dispatch
          log.debug(()=>`Dispatch a single action object, ${actionTypeMsg(allActionObjects[0])}`);
          next(allActionObjects[0]);
          return evalThunkReturnVals();

        default: // multiple action objects to dispatch
                 // ... in support batching of actions, 
                 //     we re-dispatch an action array morphed into batchActions (using redux-batched-actions middleware)
          log.debug(()=>`Re-Dispatch multiple action objects (by morphing them into batch), ${actionTypeMsg(allActionObjects)}`);
          return dispatch( batchActions( allActionObjects ));
      }

    }
    finally {
      log.follow(()=>`EXIT ${log.filterName} for action: ${actionTypeMsg(action)}`);
    }
  }
  

  // prime the log-filter pump for the BATCHING_REDUCER, because this is NOT part of our AT
  // ... this merely promotes the log filter prior to it being executed at run-time
  //     normally this happens in the module scope
  getActionLog(BATCH);
  
  
  
  // define a redux middleware hook for logging all action probes
  const actionLogger = store => next => action => {
    const log = new Log('middleware.actionLogger');
    try {
      log.follow(()=>`ENTER ${log.filterName} for action: ${actionTypeMsg(action)}`);

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
          const clarification         = !log.isTraceEnabled() && actionIsObj
                                      ? '... NOTE: reconfigure log to TRACE to see action details (CAUTION: actions with payload can be LARGE)'
                                      : '';
          return `ENTER${batched ? ' [BATCHED] ' : ' '}action: ${actionTypeMsg(action)} ${clarification}`
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
        log.follow(()=>`EXIT${batched ? ' [BATCHED] ' : ' '}action: ${actionTypeMsg(action)}`); 
      }
      if (action.type == BATCH) { // ... use == because our types are String objects ... NOT string built-ins
        action.payload.concat().reverse().forEach(logExit);
      }
      logExit(action, null, null, false);
      
      // that's all folks
      return result;
    }
    finally {
      log.follow(()=>`EXIT ${log.filterName} for action: ${actionTypeMsg(action)}`);
    }
  }
  
  
  // define our Redux app-wide store
  const appStore = Redux.createStore(enableBatching(appState), // our app-wide redux reducer ... wrapped in a batch-capable reducer
                                     Redux.compose(Redux.applyMiddleware(errorHandler,      // ... inject FIRST to allow coverage of other middleware components
                                                                         thunkBatchHandler, // ... inject before actionLogger (minor: doesn't have a type)
                                                                         actionLogger       // ... inject early to allow logging of other middleware components
                                                                         /* thunk */),      // thunks NOW supported through our own thunkBatchHandler
                                                   reduxDevToolsChromeExtension)); // hook into optional Redux DevTools Chrome Extension

  return appStore;
}
