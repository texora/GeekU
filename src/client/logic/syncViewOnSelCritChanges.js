'use strict';

import createNamedLogic, * as LOGIC  from './util/createNamedLogic';
import actions    from '../actions';
import selectors  from '../state';
import SelCrit    from '../../shared/domain/SelCrit';


/**
 * Sync (i.e. re-retrieve) the appropriate itemsView when it is 
 * based on a selCrit that has changed.
 */
export default createNamedLogic('syncViewOnSelCritChanges', {

  type: String(actions.selCrit.changed),

  process({getState, action, log}, dispatch) {

    const appState      = getState();
    const selCrit       = action.selCrit;
    const syncDirective = action.syncDirective;

    // EXPLICITLY update view with supplied selCrit per action.syncDirective (typically used for new selCrit objects)
    // ... NO sync explicitly requested
    if (syncDirective === SelCrit.SyncDirective.none) {
      log.debug(()=>`Explicitly NO view sync was requested syncDirective: ${syncDirective}`);
      dispatch();
    }
    // ... explicit sync and activate
    else if (syncDirective === SelCrit.SyncDirective.activate) {
      log.debug(()=>`syncing ${selCrit.itemType} view (action: actions.itemsView) because of explicit syncDirective: ${syncDirective}`);
      dispatch( actions.itemsView(selCrit.itemType, selCrit, 'activate') );
    }
    // ... explicit sync with NO activate
    else if (syncDirective === SelCrit.SyncDirective.reflect) {
      log.debug(()=>`syncing ${selCrit.itemType} view (action: actions.itemsView.retrieve) because of explicit syncDirective: ${syncDirective}`);
      dispatch( actions.itemsView.retrieve(selCrit.itemType, selCrit) );
    }
    // OTHERWISE: conditionally refresh view when it is based on this changed selCrit
    //            NOTE: only remaining SelCrit.SyncDirective option === default
    else if (selectors.isSelCritActiveInView(appState, selCrit)) {
      log.debug(()=>`syncing ${selCrit.itemType} view (action: actions.itemsView.retrieve) because it is based on a selCrit: ${selCrit.name} that has changed (syncDirective: ${syncDirective})`);
      dispatch( actions.itemsView.retrieve(selCrit.itemType, selCrit) );
    }
    // ... no need for view sync
    else {
      log.debug(()=>`NO need to sync view because our active view is NOT based on this changed selCrit: ${selCrit.name} (syncDirective: ${syncDirective})`);
      dispatch();
    }

  },

});
