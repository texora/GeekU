'use strict';

import * as LOGIC  from './LogicUtil';
import {AT, AC}    from '../actions';


/**
 * Process (i.e. implement) the AT.selCrit.save action.
 */
const [logicName, logic] = LOGIC.promoteLogic('processSelCritSaveAction', {

  type: AT.selCrit.save.valueOf(),

  process({getState, action}, dispatch) {

    const log = LOGIC.getActionLog(action, logicName);

    const selCrit       = action.selCrit;
    const syncDirective = action.syncDirective;

    // perform async save of selCrit
    log.debug(()=>`initiating async save of selCrit key: ${selCrit.key}`);

    geekUFetch('/api/selCrit', { // ?? consider api utility
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selCrit)
    })
    .then( res => {
      const savedSelCrit = res.payload;
      log.debug(()=>`successful save of selCrit key: ${savedSelCrit.key}`);
      // mark async operation complete (typically spinner)
      dispatch( AC.selCrit.save.complete(savedSelCrit), LOGIC.allowMore );
      // sync app with results
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

export default logic;
