'use strict';

import * as LOGIC  from './LogicUtil';
import {AT, AC}    from '../actions';
import api         from '../../shared/api';


/**
 * Process (i.e. implement) the AT.detailItem action.
 */
const [logicName, logic] = LOGIC.promoteLogic('processDetailItemAction', {

  type: AT.detailItem.valueOf(),

  process({getState, action}, dispatch) {
    const log = LOGIC.getActionLog(action, logicName);

    const itemType = action.itemType;
    const itemNum  = action.itemNum;
    const editMode = action.editMode;

    api.items.retrieveItemDetail(itemType, itemNum, log)
       .then( item => {
         dispatch( AC.detailItem.retrieve.complete(itemType, item, editMode) );
       })
       .catch( err => {
         // mark async operation FAILED (typically spinner)
         // ... NOTE: monitored '*.fail' logic will communicate to the user, and log details
         dispatch( AC.detailItem.retrieve.fail(itemType, itemNum, editMode, err) );
       });
  },

});

export default logic;
