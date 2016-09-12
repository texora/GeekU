'use strict';

import promoteLogic      from './util/promoteLogic';
import getActionLogicLog from './util/getActionLogicLog';

import {AC}              from '../actions';
import selectors         from '../state';


/**
 * Save and use selCrit edits on completion.
 */
const [logicName, logic] = promoteLogic('saveAndUseSelCritEdits', {

  type: 'selCrit.edit.save',

  process({getState, action}, dispatch) {

    const log = getActionLogicLog(action, logicName);

    const appState = getState();
    const selCrit         = selectors.getEditSelCrit(appState).selCrit;

    // save our selCrit
    // ... NOTE: this action will emit a change notification (action: 'selCrit.changed')
    log.debug(() => "emitting action to save our selCrit (action: 'selCrit.save')");
    dispatch( AC.selCrit.save(selCrit), allowMore );

    // close out our edit dialog
    log.debug(() => "emitting action to close our edit dialog (action: 'selCrit.edit.close')");
    dispatch( AC.selCrit.edit.close() );

  },

});

export default logic;

const allowMore = { allowMore: true };
