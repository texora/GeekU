'use strict';

import promoteLogic      from './util/promoteLogic';
import getActionLogicLog from './util/getActionLogicLog';

import {AC}                  from '../actions';


/**
 * App logic to save selCrit.
 */
const [logicName, logic] = promoteLogic('saveSelCrit', {

  type: 'selCrit.save',

  process({getState, action}, dispatch) {

    const log = getActionLogicLog(action, logicName);

    const selCrit = action.selCrit;

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
      dispatch( AC.selCrit.save.complete(savedSelCrit), allowMore );
      // sync app with results
      dispatch( AC.selCrit.changed(savedSelCrit) );
    })
    .catch( err => {
      // mark async operation FAILED (typically spinner)
      dispatch( AC.selCrit.save.fail(selCrit, 
                                     err.defineAttemptingToMsg(`saving selCrit: ${selCrit.name}`)) );
    });

  },

});

export default logic;

const allowMore = { allowMore: true };
