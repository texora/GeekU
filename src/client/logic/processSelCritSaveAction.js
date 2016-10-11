'use strict';

import createNamedLogic, * as LOGIC  from './util/createNamedLogic';
import {AT, AC}  from '../actions';


/**
 * Process (i.e. implement) the AT.selCrit.save action.
 */
export default createNamedLogic('processSelCritSaveAction', {

  type: AT.selCrit.save.valueOf(),

  process({getState, action, log, api}, dispatch) {

    const selCrit       = action.selCrit;
    const syncDirective = action.syncDirective;

    log.debug(() => `issuing api.filters.saveFilter(selCrit: ${selCrit.name})`);

    api.filters.saveFilter(selCrit, log)
       .then( savedSelCrit => {
         // mark async operation complete (typically spinner)
         dispatch( AC.selCrit.save.complete(savedSelCrit), LOGIC.allowMore );
         // sync app with results
         log.debug(() => `emitting change notification (action: 'selCrit.changed') because selCrit: ${selCrit.name} has been saved`);
         dispatch( AC.selCrit.changed(savedSelCrit, syncDirective) );
       })
       .catch( err => {
         // mark async operation FAILED (typically spinner)
         // ... NOTE: monitored '*.fail' logic will communicate to the user, and log details
         dispatch( AC.selCrit.save.fail(selCrit, 
                                        err.defineAttemptingToMsg(`saving selCrit: ${selCrit.name}`)) );
       });
  },

});
