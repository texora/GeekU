'use strict';

import * as LOGIC  from './LogicUtil';
import {AC}        from '../actions';


/**
 * Process (i.e. implement) the 'itemsView' action.
 */
const [logicName, logic] = LOGIC.promoteLogic('processItemsView', {

  type: 'itemsView',

  process({getState, action}, dispatch) {

    const log = LOGIC.getActionLog(action, logicName);

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

export default logic;
