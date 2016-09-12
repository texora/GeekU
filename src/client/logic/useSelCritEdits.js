'use strict';

import * as LOGIC  from './LogicUtil';
import {AC}        from '../actions';
import selectors   from '../state';


/**
 * Use selCrit edits on completion.
 */
const [logicName, logic] = LOGIC.promoteLogic('useSelCritEdits', {

  type: 'selCrit.edit.use',

  process({getState, action}, dispatch) {

    const log = LOGIC.getActionLog(action, logicName);

    const appState = getState();
    const selCrit         = selectors.getEditSelCrit(appState).selCrit;
    const startingCurHash = selectors.getEditSelCrit(appState).extra.startingCurHash;

    // emit changed notification when selCrit has actually changed
    if (selCrit.curHash !== startingCurHash) {
      log.debug(() => "emitting change notification (action: 'selCrit.changed') because selCrit has actually changed");
      dispatch( AC.selCrit.changed(selCrit), LOGIC.allowMore );
    }

    // close out our edit dialog
    log.debug(() => "emitting action to close our edit dialog (action: 'selCrit.edit.close')");
    dispatch( AC.selCrit.edit.close() );

  },

});

export default logic;
