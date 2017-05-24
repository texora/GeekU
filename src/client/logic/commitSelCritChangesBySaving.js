'use strict';

import createNamedLogic, * as LOGIC  from './util/createNamedLogic';
import actions    from '../actions';
import selectors  from '../state';


/**
 * Commit (i.e. use) selCrit changes BY saving them upon completion.
 */
export default createNamedLogic('commitSelCritChangesBySaving', {

  type: String(actions.selCrit.edit.save),

  process({getState, action, log}, dispatch) {

    const appState      = getState();
    const selCrit       = selectors.getEditSelCrit(appState).selCrit;
    const syncDirective = selectors.getEditSelCrit(appState).extra.syncDirective;

    // save our selCrit
    // ... NOTE: this action will emit a change notification (action: 'selCrit.changed')
    log.debug(() => "emitting action to save our selCrit (action: 'selCrit.save')");
    dispatch( actions.selCrit.save(selCrit, syncDirective), LOGIC.allowMore );

    // close out our edit dialog
    log.debug(() => "emitting action to close our edit dialog (action: 'selCrit.edit.close')");
    dispatch( actions.selCrit.edit.close() );

  },

});
