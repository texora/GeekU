'use strict';

import createNamedLogic, * as LOGIC  from './util/createNamedLogic';
import actions   from '../actions';


/**
 * Process (i.e. implement) the actions.detailItem action.
 */
export default createNamedLogic('processDetailItemAction', {

  type: String(actions.detailItem),

  process({getState, action, log, api}, dispatch) {

    const itemType = action.itemType;
    const itemNum  = action.itemNum;
    const editMode = action.editMode;

    log.debug(() => `issuing api.items.retrieveItemDetail(${FMT(itemType)}, ${FMT(itemNum)})`);

    api.items.retrieveItemDetail(itemType, itemNum, log)
       .then( item => {
         dispatch( actions.detailItem.retrieve.complete(itemType, item, editMode) );
       })
       .catch( err => {
         // mark async operation FAILED (typically spinner)
         // ... NOTE: monitored '*.fail' logic will communicate to the user, and log details
         dispatch( actions.detailItem.retrieve.fail(itemType, itemNum, editMode, err) );
       });
  },

});
