'use strict';

import createNamedLogic, * as LOGIC  from './util/createNamedLogic';
import actions   from '../actions';


/**
 * Process (i.e. implement) the actions.filters.retrieve action.
 */
export default createNamedLogic('processFiltersRetrieveAction', {

  type: String(actions.filters.retrieve),

  process({getState, action, log, api}, dispatch) {

    log.debug(() => 'issuing api.filters.retrieveFilters()');

    api.filters.retrieveFilters(undefined, log)
       .then( filters => {
         dispatch( actions.filters.retrieve.complete(filters) );
       })
       .catch( err => {
         // mark async operation FAILED (typically spinner)
         // ... NOTE: monitored '*.fail' logic will communicate to the user, and log details
         dispatch( actions.filters.retrieve.fail(err) );
       });
  },

});
