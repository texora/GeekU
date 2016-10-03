'use strict';

import * as Redux                from 'redux';
import appState                  from '../state/appState';
import { createLogicMiddleware } from 'redux-logic';
import logic                     from '../logic';
import api                       from '../../shared/api';
import Log                       from '../../shared/util/Log';

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
  
  // accumulate all our logic modules (redux-logic)
  const logicMiddleware = createLogicMiddleware(logic, 
                                                { // injected dependancies
                                                  geekU: {
                                                    api
                                                  }
                                                });

  // define our Redux app-wide store, WITH our middleware registration
  const appStore = Redux.createStore(appState, // our app-wide redux reducer
                                     Redux.compose(Redux.applyMiddleware(logicMiddleware), // redux-logic middleware
                                                   reduxDevToolsChromeExtension));         // optional Redux DevTools Chrome Extension

  return appStore;
}
