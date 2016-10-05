'use strict';

import createNamedLogic, * as LOGIC  from './util/createNamedLogic';
import {AT, AC}  from '../actions';


/**
 * Process (i.e. implement) the AT.detailItem action.
 */
export default createNamedLogic('processDetailItemAction', {

  type: AT.detailItem.valueOf(),

  process({getState, action, log, geekU}, dispatch) {

    const itemType = action.itemType;
    const itemNum  = action.itemNum;
    const editMode = action.editMode;

    log.debug(() => `issuing api.items.retrieveItemDetail(${FMT(itemType)}, ${FMT(itemNum)})`);

    geekU.api.items.retrieveItemDetail(itemType, itemNum, log)
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
