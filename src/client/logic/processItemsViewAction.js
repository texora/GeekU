'use strict';

import createNamedLogic, * as LOGIC  from './util/createNamedLogic';
import actions   from '../actions';


/**
 * Process (i.e. implement) the actions.itemsView action.
 */
export default createNamedLogic('processItemsViewAction', {

  type: String(actions.itemsView),

  process({getState, action, log}, dispatch) {

    // interpret the retrieve directive
    if (action.retrieve) {
      log.debug(() => "emitting actions.itemsView.retrieve() per action directive");
      dispatch( actions.itemsView.retrieve(action.itemType, action.retrieve), LOGIC.allowMore );
    }

    // interpret the activate directive
    if (action.activate == 'activate') {
      log.debug(() => "emitting actions.itemsView.activate() per action directive");
      dispatch( actions.itemsView.activate(action.itemType), LOGIC.allowMore );
    }

    // that's all folks
    dispatch();
  },

});
