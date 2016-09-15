'use strict';

import * as LOGIC            from './LogicUtil';
import {AT, AC}              from '../actions';


/**
 * Process (i.e. implement) the 'filters.retrieve' action.
 */
const [logicName, logic] = LOGIC.promoteLogic('processFiltersRetrieve', {

  type: AT.filters.retrieve.valueOf(),

  process({getState, action}, dispatch) {

    const log = LOGIC.getActionLog(action, logicName);

    log.debug(()=>'retrieving our filters (a list of selCrit objects)');

    const url = '/api/selCrit';
    geekUFetch(url)
    .then( res => {
      // sync app with results
      const filters = res.payload;
      log.debug(()=>`successful retrieval ... ${filters.length} filters returned`);
      dispatch( AC.filters.retrieve.complete(filters) ); // mark async operation complete (typically spinner)
    })
    .catch( err => {
      // mark async operation FAILED (typically spinner)
      // ... NOTE: monitored '*.fail' logic will communicate to the user, and log details
      dispatch( AC.filters.retrieve.fail(err) );
    });

  },

});

export default logic;
