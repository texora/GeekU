'use strict';

import createNamedLogic, * as LOGIC  from './util/createNamedLogic';
import actions    from '../actions';
import selectors  from '../state';


/**
 * Commit (i.e. use) selCrit changes upon completion.
 */
export default createNamedLogic('commitSelCritChanges', {

  type: String(actions.selCrit.edit.use),

  process({getState, action, log}, dispatch) {

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
      dispatch( actions.selCrit.changed(selCrit, syncDirective), LOGIC.allowMore );
    }
    // ... when existing selCrit has actually changed
    else if (selCrit.curHash !== startingCurHash) {
      log.debug(() => "emitting change notification (action: 'selCrit.changed') because existing selCrit has actually changed");
      dispatch( actions.selCrit.changed(selCrit, syncDirective), LOGIC.allowMore );
    }
    else {
      log.debug(() => "NO NEED to emit change notification (action: 'selCrit.changed') because either the selCrit has NOT changed or it is NOT new");
    }

    // close out our edit dialog
    log.debug(() => "emitting action to close our edit dialog (action: 'selCrit.edit.close')");
    dispatch( actions.selCrit.edit.close() );

  },

});
