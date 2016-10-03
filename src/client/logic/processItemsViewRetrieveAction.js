'use strict';

import * as LOGIC            from './LogicUtil';
import {AT, AC}              from '../actions';
import selectors             from '../state';
import SelCrit               from '../../shared/domain/SelCrit';


/**
 * Process (i.e. implement) the AT.itemsView.retrieve action.
 */
const [logicName, logic] = LOGIC.promoteLogic('processItemsViewRetrieveAction', {

  type: AT.itemsView.retrieve.valueOf(),

  // our stimulus:
  //  - action.itemType 
  //  - action.selCrit
  //     * SelCrit:   conditionally retrieve items when supplied selCrit is different (or out-of-date) from ItemsView selCrit
  //     * 'refresh': unconditionally refresh ItemsView with latest items (using view's current selCrit)

  transform({ getState, action, ctx }, next, reject) {

    const log = LOGIC.getActionLog(action, logicName);

    const appState         = getState();
    const itemType         = action.itemType;
    const itemsViewSelCrit = selectors.getItemsViewSelCrit(appState, itemType);

    // resolve selCrit to use in retrieval (if any)
    const selCrit = (action.selCrit === 'refresh')
                      ? itemsViewSelCrit // refresh current view (can be null if never retrieved)
                      : SelCrit.isFullyEqual(action.selCrit, itemsViewSelCrit)
                          ? null            // same selCrit as in view (no retrieval needed)
                          : action.selCrit; // a different selCrit (or out-of-date) from our view

    // communicate any resolved selCrit to process() ... below
    if (selCrit) {
      ctx.selCrit = selCrit;
      next(action);
    }
    // no-op when nothing to retrieve
    else {
      log.debug(() => "NO itemsView retrieval to perform (either supplied action.selCrit was the same as current view, or a 'refresh' request was made for a view that has not-yet retrieved");
      // NOTE: We DO NOT want to propogate this action
      //       - either to our reducers ... because we don't want to allow this action to start a spinner
      //       - or our process() ... because there is nothing to do
      reject();
    }

  },

  process({getState, action, ctx, geekU}, dispatch) {

    const log = LOGIC.getActionLog(action, logicName);

    const selCrit    = ctx.selCrit; // resolved in transform() ... above
    const itemType   = action.itemType;


    //***
    //*** at this point we know we must retrieve/refresh the items in our itemView
    //***

    geekU.api.items.retrieveItems(selCrit, log)
         .then( items => {
           dispatch( AC.itemsView.retrieve.complete(itemType, selCrit, items) );
         })
         .catch( err => {
           // mark async operation FAILED (typically spinner)
           // ... NOTE: monitored '*.fail' logic will communicate to the user, and log details
           dispatch( AC.itemsView.retrieve.fail(itemType, selCrit, err) );
         });
  },

});

export default logic;
