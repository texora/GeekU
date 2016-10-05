'use strict';

import createNamedLogic, * as LOGIC  from './util/createNamedLogic';
import {AT, AC}  from '../actions';


/**
 * Process (i.e. implement) the AT.filters.retrieve action.
 */
export default createNamedLogic('processFiltersRetrieveAction', {

  type: AT.filters.retrieve.valueOf(),

  process({getState, action, log, geekU}, dispatch) {

    log.debug(() => 'issuing api.filters.retrieveFilters()');

    geekU.api.filters.retrieveFilters(undefined, log)
         .then( filters => {
           dispatch( AC.filters.retrieve.complete(filters) );
         })
         .catch( err => {
           // mark async operation FAILED (typically spinner)
           // ... NOTE: monitored '*.fail' logic will communicate to the user, and log details
           dispatch( AC.filters.retrieve.fail(err) );
         });
  },

});
