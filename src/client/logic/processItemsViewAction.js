'use strict';

import createNamedLogic, * as LOGIC  from './util/createNamedLogic';
import {AT, AC}  from '../actions';


/**
 * Process (i.e. implement) the AT.itemsView action.
 */
export default createNamedLogic('processItemsViewAction', {

  type: AT.itemsView.valueOf(),

  process({getState, action, log}, dispatch) {

    // interpret the retrieve directive
    if (action.retrieve) {
      log.debug(() => "emitting AC.itemsView.retrieve() per action directive");
      dispatch( AC.itemsView.retrieve(action.itemType, action.retrieve), LOGIC.allowMore );
    }

    // interpret the activate directive
    if (action.activate == 'activate') {
      log.debug(() => "emitting AC.itemsView.activate() per action directive");
      dispatch( AC.itemsView.activate(action.itemType), LOGIC.allowMore );
    }

    // that's all folks
    dispatch();
  },

});
