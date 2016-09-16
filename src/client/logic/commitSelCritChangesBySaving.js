'use strict';

import * as LOGIC  from './LogicUtil';
import {AT, AC}    from '../actions';
import selectors   from '../state';


/**
 * Commit (i.e. use) selCrit changes BY saving them upon completion.
 */
const [logicName, logic] = LOGIC.promoteLogic('commitSelCritChangesBySaving', {

  type: AT.selCrit.edit.save.valueOf(),

  process({getState, action}, dispatch) {

    const log = LOGIC.getActionLog(action, logicName);

    const appState      = getState();
    const selCrit       = selectors.getEditSelCrit(appState).selCrit;
    const syncDirective = selectors.getEditSelCrit(appState).extra.syncDirective;

    // save our selCrit
    // ... NOTE: this action will emit a change notification (action: 'selCrit.changed')
    log.debug(() => "emitting action to save our selCrit (action: 'selCrit.save')");
    dispatch( AC.selCrit.save(selCrit, syncDirective), LOGIC.allowMore );

    // close out our edit dialog
    log.debug(() => "emitting action to close our edit dialog (action: 'selCrit.edit.close')");
    dispatch( AC.selCrit.edit.close() );

  },

});

export default logic;
