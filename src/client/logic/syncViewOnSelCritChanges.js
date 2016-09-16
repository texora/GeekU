'use strict';

import * as LOGIC  from './LogicUtil';
import {AT, AC}    from '../actions';
import selectors   from '../state';
import SelCrit     from '../../shared/domain/SelCrit';


/**
 * Sync (i.e. re-retrieve) the appropriate itemsView when it is 
 * based on a selCrit that has changed.
 */
const [logicName, logic] = LOGIC.promoteLogic('syncViewOnSelCritChanges', {

  type: AT.selCrit.changed.valueOf(),

  process({getState, action}, dispatch) {

    const log = LOGIC.getActionLog(action, logicName);

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
      log.debug(()=>`syncing ${selCrit.itemType} view (action: AT.itemsView) because of explicit syncDirective: ${syncDirective}`);
      dispatch( AC.itemsView(selCrit.itemType, selCrit, 'activate') );
    }
    // ... explicit sync with NO activate
    else if (syncDirective === SelCrit.SyncDirective.reflect) {
      log.debug(()=>`syncing ${selCrit.itemType} view (action: AT.itemsView.retrieve) because of explicit syncDirective: ${syncDirective}`);
      dispatch( AC.itemsView.retrieve(selCrit.itemType, selCrit) );
    }
    // OTHERWISE: conditionally refresh view when it is based on this changed selCrit
    //            NOTE: only remaining SelCrit.SyncDirective option === default
    else if (selectors.isSelCritActiveInView(appState, selCrit)) {
      log.debug(()=>`syncing ${selCrit.itemType} view (action: AT.itemsView.retrieve) because it is based on a selCrit: ${selCrit.name} that has changed (syncDirective: ${syncDirective})`);
      dispatch( AC.itemsView.retrieve(selCrit.itemType, selCrit) );
    }
    // ... no need for view sync
    else {
      log.debug(()=>`NO need to sync view because our active view is NOT based on this changed selCrit: ${selCrit.name} (syncDirective: ${syncDirective})`);
      dispatch();
    }

  },

});

export default logic;
