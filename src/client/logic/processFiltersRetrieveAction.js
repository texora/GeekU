'use strict';

import * as LOGIC  from './LogicUtil';
import {AT, AC}    from '../actions';
import api         from '../../shared/api';


/**
 * Process (i.e. implement) the AT.filters.retrieve action.
 */
const [logicName, logic] = LOGIC.promoteLogic('processFiltersRetrieveAction', {

  type: AT.filters.retrieve.valueOf(),

  process({getState, action}, dispatch) {
    const log = LOGIC.getActionLog(action, logicName);

    api.filters.retrieveFilters(undefined, log)
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

export default logic;
