'use strict';

import promoteLogic      from './util/promoteLogic';
import getActionLogicLog from './util/getActionLogicLog';

import {AC}                  from '../actions';
import selectors             from '../state';


/**
 * App logic that syncs appropriate view when it is based on a selCrit that has changed.
 */
const [logicName, logic] = promoteLogic('syncViewWhenSelCritChanged', {

  type: 'selCrit.changed',

  process({getState, action}, dispatch) {

    const log = getActionLogicLog(action, logicName);

    const appState  = getState();
    const selCrit   = action.selCrit;

    // conditionally refresh view when based on this changed selCrit
    if (selectors.isSelCritActiveInView(appState, selCrit)) {
      log.debug(()=>`syncing view: ${selCrit.itemType}, because it is based on a selCrit that has changed: ${selCrit.name}`);
      dispatch( AC.itemsView(selCrit.itemType, selCrit, 'no-activate') );
    }
    else {
      dispatch();
    }

  },

});

export default logic;
