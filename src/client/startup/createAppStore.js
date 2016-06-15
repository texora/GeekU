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
  
  
  // define our central error handler for uncaught exceptions
  let   errInInProgress = null;  // ... used to detect recursive errors (see below)
  const errorHandler = store => next => action => {
    
    const log = new Log('middleware.errorHandler');
  
    try { // defer to original dispatch action logic
      log.debug(()=>`ENTER ${log.filterName} for action: ${action.type}`);
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
      log.debug(()=>`EXIT ${log.filterName} for action: ${action.type}`);
    }
  }
  
  
  
  // define our batch handler ... morphing action arrays into batchActions
  const batchHandler = store => next => action => {
    const log = new Log('middleware.batchHandler');
    try {
      log.debug(()=>`ENTER ${log.filterName} for action: ${action.type}`);
      return Array.isArray(action)
        ? store.dispatch( batchActions(action) ) // morph action arrays into batchActions, and re-dispatch
        : next(action);
    }
    finally {
      log.debug(()=>`EXIT ${log.filterName} for action: ${action.type}`);
    }
  }
  
  // prime the log-filter pump for the BATCHING_REDUCER, because this is NOT part of our AT
  // ... this merely promotes the filter prior to it being executed at run-time
  //     normally this happens in the module scope
  getActionLog(BATCH);
  
  
  
  // define a redux middleware hook for logging all action flow
  const actionLogger = store => next => action => {
    const log = new Log('middleware.actionLogger');
    try {
      log.debug(()=>`ENTER ${log.filterName} for action: ${action.type}`);

      // log "ENTER" probe
      // NOTE: We have special logic to support batched sub-actions 
      //       ... because action batching occurs at the reducer level (NOT the dispatching level),
      //           we do NOT see the sub-action dispatch log entries
      //           WITHOUT this enhancement
      function logEnter(action, indx, arr, batched=true) {
        const actionIsFunct = typeof action === 'function';
        const actionIsObj   = !actionIsFunct;
        const log           = getActionLog(action.type);
      
        // special validation, cannot handle batched thunks
        if (batched && actionIsFunct) {
          throw new Error(`Developer Error - GeekU action batching does NOT support thunks ('${action.type}'), because batching is handled at the reducer-level rather than the dispatching-level`);
        }
      
        log.flow(()=> {
          const embellishedActionType = action.type + (actionIsFunct ? ' (a thunk)' : ' (an object)');
          const clarification         = !log.isVerboseEnabled() && actionIsObj
                                      ? '... NOTE: reconfigure log to VERBOSE to see action details (CAUTION: actions with payload can be LARGE)'
                                      : '';
          return `ENTER${batched ? ' [BATCHED] ' : ' '}action: ${embellishedActionType} ${clarification}`
        });
        if (actionIsObj) {
          log.verbose(()=>'action details:\n', action);
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
        log.flow(()=>`EXIT${batched ? ' [BATCHED] ' : ' '}action: ${action.type}`);
      }
      if (action.type == BATCH) { // ... use == because our types are String objects ... NOT string built-ins
        action.payload.concat().reverse().forEach(logExit);
      }
      logExit(action, null, null, false);
      
      // that's all folks
      return result;
    }
    finally {
      log.debug(()=>`EXIT ${log.filterName} for action: ${action.type}`);
    }
  }
  
  
  // define our Redux app-wide store
  const appStore = Redux.createStore(enableBatching(appState), // our app-wide redux reducer ... wrapped in a batch-capable reducer
                                     Redux.compose(Redux.applyMiddleware(errorHandler, // central uncaught exception handler ... inject FIRST to allow coverage of other middleware components
                                                                         batchHandler, // morph action arrays into batchActions ... inject before actionLogger (minor: doesn't have a type)
                                                                         actionLogger, // log each action ... inject early to allow logging of other middleware components
                                                                         thunk),       // support function-based actions (ex: support async actions)
                                                   reduxDevToolsChromeExtension)); // hook into optional Redux DevTools Chrome Extension

  return appStore;
}
