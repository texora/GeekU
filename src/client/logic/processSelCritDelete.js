'use strict';

import * as LOGIC  from './LogicUtil';
import {AT, AC}    from '../actions';
import selectors   from '../state';
import SelCrit     from '../../shared/domain/SelCrit';
import Confirm     from '../comp/Confirm'


/**
 * Process (i.e. implement) the 'selCrit.delete' action.
 */
const [logicName, logic] = LOGIC.promoteLogic('processSelCritDelete', {

  type: AT.selCrit.delete.valueOf(),


  transform({ getState, action }, next, reject) {

    const log = LOGIC.getActionLog(action, logicName);

    const selCrit = action.selCrit;

    // obtain userconfirmation before we delete the selCrit
    Confirm.display({
      title: 'Delete Filter',
      msg:   `Please confirm deletion of filter: ${selCrit.name} -  ${selCrit.desc}`,
      actions: [
        { txt: 'Delete',
          action: () => {
            log.debug(()=>`deletion selCrit: ${selCrit.name} has been confirmed by user`);
            next(action);
          }
        },
        { txt: 'Cancel',
          action: () => {
            // NOTE: We DO NOT want to propogate this action
            //       - either to our reducers ... because we don't want to allow this action to start a spinner
            //       - or our process() ... because there is nothing to do
            log.debug(()=>`deletion selCrit: ${selCrit.name} has been canceled by user confirmation`);
            reject();
          }
        },
      ]
    });

  },


  process({getState, action}, dispatch) {
    
    const log = LOGIC.getActionLog(action, logicName);

    const selCrit      = action.selCrit;
    const appState     = getState();
    const impactView   = selectors.isSelCritActiveInView(appState, selCrit) ? selCrit.itemType : null;
    const inMemoryOnly = !SelCrit.isPersisted(selCrit);


    // for in-memory deletion, we merely dispatch the completion action
    if (inMemoryOnly) {
      log.debug(()=>`in-memory deletion of selCrit: ${selCrit.name} by emitting: AC.selCrit.delete.complete `);
      dispatch( AC.selCrit.delete.complete(selCrit, impactView) );
    }

    // for persistent DB selCrit deletion, issue issue the async API delete request
    else {
      log.debug(()=>`initiating async delete of selCrit: ${selCrit.name}`);
      const url = `/api/selCrit/${selCrit.key}`;
      geekUFetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(selCrit)
      })
      .then( res => {
        // sync app with results
        log.debug(()=>`successful delete of selCrit: ${selCrit.name}`);
        dispatch( AC.selCrit.delete.complete(selCrit, impactView) );
      })
      .catch( err => {
        // mark async operation FAILED (typically spinner)
        // ... NOTE: monitored '*.fail' logic will communicate to the user, and log details
        dispatch( AC.selCrit.delete.fail(selCrit, err) );
      });
    }

  },

});

export default logic;
