'use strict';

import * as LOGIC  from './LogicUtil';
import {AT, AC}    from '../actions';
import selectors   from '../state';


/**
 * Use selCrit edits on completion.
 */
const [logicName, logic] = LOGIC.promoteLogic('commitSelCritChanges', {

  type: AT.selCrit.edit.use.valueOf(),

  process({getState, action}, dispatch) {

    const log = LOGIC.getActionLog(action, logicName);

    const appState = getState();
    const selCrit         = selectors.getEditSelCrit(appState).selCrit;
    const extra           = selectors.getEditSelCrit(appState).extra;
    const startingCurHash = extra.startingCurHash;
    const isNew           = extra.isNew;
    const syncDirective   = extra.syncDirective;

    // emit changed notification 
    // ... when selCrit is new
    if (isNew) {
      log.debug(() => "emitting change notification (action: 'selCrit.changed') because selCrit is new");
      dispatch( AC.selCrit.changed(selCrit, syncDirective), LOGIC.allowMore );
    }
    // ... when existing selCrit has actually changed
    else if (selCrit.curHash !== startingCurHash) {
      log.debug(() => "emitting change notification (action: 'selCrit.changed') because existing selCrit has actually changed");
      dispatch( AC.selCrit.changed(selCrit, syncDirective), LOGIC.allowMore );
    }

    // close out our edit dialog
    log.debug(() => "emitting action to close our edit dialog (action: 'selCrit.edit.close')");
    dispatch( AC.selCrit.edit.close() );

  },

});

export default logic;
