'use strict';

import createNamedLogic, * as LOGIC  from './util/createNamedLogic';
import {AT, AC}   from '../actions';
import selectors  from '../state';
import SelCrit    from '../../shared/domain/SelCrit';


/**
 * Process (i.e. implement) the AT.itemsView.retrieve action.
 */
export default createNamedLogic('processItemsViewRetrieveAction', {

  type: AT.itemsView.retrieve.valueOf(),

  // our stimulus:
  //  - action.itemType 
  //  - action.selCrit
  //     * SelCrit:   conditionally retrieve items when supplied selCrit is different (or out-of-date) from ItemsView selCrit
  //     * 'refresh': unconditionally refresh ItemsView with latest items (using view's current selCrit)

  transform({ getState, action, ctx, log }, next, reject) {

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
      log.debug(() => `the conditional itemsView retrieval IS NEEDED for selCrit: ${selCrit.name} ... either the supplied action.selCrit HAS changed from the view, or a 'refresh' request was made`);
      ctx.selCrit = selCrit;
      next(action);
    }
    // no-op when nothing to retrieve
    else {
      log.debug(() => `the conditional itemsView retrieval IS NOT NEEDED for selCrit: ${selCrit.name} ... either the supplied action.selCrit has NOT changed from the view, or a 'refresh' request was made for a view that has not-yet retrieved`);
      // NOTE: We DO NOT want to propogate this action
      //       - either to our reducers ... because we don't want to allow this action to start a spinner
      //       - or our process() ... because there is nothing to do
      reject();
    }

  },

  process({getState, action, ctx, log, api}, dispatch) {

    const selCrit    = ctx.selCrit; // resolved in transform() ... above
    const itemType   = action.itemType;


    //***
    //*** at this point we know we must retrieve/refresh the items in our itemView
    //***

    log.debug(() => `issuing api.items.retrieveItems(selCrit: ${selCrit.name})`);

    api.items.retrieveItems(selCrit, log)
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
