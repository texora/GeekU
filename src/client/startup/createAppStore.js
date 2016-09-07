'use strict';

import * as Redux         from 'redux';
import {enableBatching}   from 'redux-batched-actions';
import appState           from '../state/appState';

//import thunk            from 'redux-thunk';// thunks NOW supported through our own thunkBatchHandler (we should remove the package)
import errorHandler       from './middleware/errorHandler';
import thunkBatchHandler  from './middleware/thunkBatchHandler';
import actionLogger       from './middleware/actionLogger';

import { createLogicMiddleware } from 'redux-logic';
import logic                     from '../logic';

import Log                from '../../shared/util/Log';

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
  
  const logicMiddleware = createLogicMiddleware(logic); // ??? can I use dependancies (the optional 2nd arg)

  // define our Redux app-wide store, WITH our middleware registration
  const appStore = Redux.createStore(enableBatching(appState), // our app-wide redux reducer ... wrapped in a batch-capable reducer
                                     Redux.compose(Redux.applyMiddleware(errorHandler,      // ... inject FIRST to allow coverage of other middleware components
                                                                         thunkBatchHandler, // ... inject before actionLogger (minor: doesn't have a type)
                                                                         actionLogger,      // ... inject early to allow logging of other middleware components
                                                                         /* thunk, */       // thunks NOW supported through our own thunkBatchHandler
                                                                         logicMiddleware),  // redux-logic middleware
                                                   reduxDevToolsChromeExtension)); // hook into optional Redux DevTools Chrome Extension

  return appStore;
}
