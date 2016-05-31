'use strict';

import Log            from '../shared/util/Log';
import {getActionLog} from './state/actions';

import * as Redux from 'redux';
import appState   from './state/appState';

import thunk from 'redux-thunk';


/*--------------------------------------------------------------------------------
   Promote our GeekU Redux appStore.
   --------------------------------------------------------------------------------*/

const log = new Log('startup.appStore');

log.info(()=> 'creating our GeekU Redux appStore');

// locate the optional Redux DevTools Chrome Extension
// ... if installed in this browser instance
const reduxDevToolsChromeExtension = window.devToolsExtension ? window.devToolsExtension() : undefined;
log.info(()=> `the optional Redux DevTools Chrome Extension ${reduxDevToolsChromeExtension ? 'IS' : "IS NOT"} PRESENT!`);


// define a redux middleware hook for logging all action flow
const actionLogger = store => next => action => {

  // log "enter" probe
  const actionIsFunct = typeof action === 'function';
  const actionIsObj   = !actionIsFunct;
  const log           = getActionLog(action.type);

  log.flow(()=> {
    const embellishedActionType = action.type + (actionIsFunct ? ' (a thunk)' : ' (an object)');
    const clarification         = !log.isDebugEnabled() && actionIsObj
                                    ? '... NOTE: reconfigure log to DEBUG to see action details (CAUTION: may be LARGE when action contains retrieval payload)'
                                    : '';
    return `enter action: ${embellishedActionType} ${clarification}`
  });
  if (actionIsObj) {
    log.debug(()=>'action details:\n', action);
  }

  // defer to original dispatch action logic
  const result = next(action);

  // log "exit" probe
  // ?? we could log store.getState(), but that is WAY TOO MUCH ... CONSIDER DIFF LOGIC
  //    ... simply retain beforeState (above) and afterState here
  log.flow(()=>`exit action: ${action.type}`);

  // that's all folks
  return result;
}


// define our Redux app-wide store
const appStore = Redux.createStore(appState, // our app-wide redux reducer
                                   Redux.compose(Redux.applyMiddleware(actionLogger, // log each action ... inject first to allow logging of other middleware components
                                                                       thunk),       // support function-based actions (ex: support async actions)
                                                 reduxDevToolsChromeExtension)); // hook into optional Redux DevTools Chrome Extension

// promote our appStore
export default appStore;
