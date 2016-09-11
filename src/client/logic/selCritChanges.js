'use strict';
// ??? OBSOLETE ENTIRE MODULE

import {createLogic}         from 'redux-logic';
import getActionLog          from '../actions/getActionLog';

import {AC}                  from '../actions';
import selectors             from '../state';
import handleUnexpectedError from '../util/handleUnexpectedError';

import SelCrit               from '../../shared/domain/SelCrit';
import itemTypes             from '../../shared/domain/itemTypes';


//***
//*** logic supporting changes to selCrit
//***


// ??? interpretEditOfNewSelCrit
// ??? injectAdditionalDataForEditSelCrit
const monitor_selCrit_edit = createLogic({

  type: 'selCrit.edit',

  transform({ getState, action }, next) {

    const log = getActionLog(action.type);

    let selCrit = action.selCrit;

    // interpret itemType string as new SelCrit
    // ... injecting into action's real selCrit (new) and maintaining selCritIsNew indicator
    if (typeof selCrit === 'string') {

      log.debug(()=> `injecting new SelCrit of type: ${FMT(selCrit)}`);
      action.selCrit = selCrit = SelCrit.new(selCrit);
      action.selCritIsNew = true;
    }
    else {
      action.selCritIsNew = false;
    }

    // inject the DB meta definition we are working for
    const meta = action.meta = itemTypes.meta[selCrit.itemType];

    // inject the total set of fieldOptions promoted to the user
    // ... derived from meta.validFields
    const fieldOptions = action.fieldOptions = [];
    for (const fieldName in meta.validFields) {
      const fieldLabel = meta.validFields[fieldName];
      if (fieldLabel) { // missing field label is a control indication to NOT promote field to user
        fieldOptions.push( { value: fieldName, label: fieldLabel } );
      }
    }

    // inject the total set of sortOptions promoted to the user
    // ... derived from meta.validFields
    const sortOptions = action.sortOptions = [];
    for (const fieldName in meta.validFields) {
      const fieldLabel = meta.validFields[fieldName];
      if (fieldLabel) { // missing field label is a control indication to NOT promote field to user
        sortOptions.push( { value: fieldName, label: fieldLabel, ascDec: 1 } );
      }
    }

    // pass on action with newly injected properties
    next(action);
  }

});



const monitor_selCrit_edit_complete = createLogic({

  type: 'selCrit.edit.complete',

  validate({getState, action, ctx}, allow, reject) {

    const log = getActionLog(action.type);

    const appState = getState();
    const selCrit  = selectors.getEditSelCrit(appState).selCrit;

    // retain necessary information that will be cleared from our state prior to our process() execution
    ctx.selCrit         = selCrit;
    ctx.startingCurHash = selectors.getEditSelCrit(appState).extra.startingCurHash;

    // apply validation
    if (action.completionType !== 'cancel' &&
        SelCrit.validate(selCrit)) {
      log.inspect(()=> `Rejecting Action: ${FMT(action.type)} due to validation errors`);
      reject( AC.userMsg.display('Please resolve the highlighted validation errors.') );
    }
    else {
      allow( action );
    }
  },

  process({getState, action, ctx}, dispatch) {

    const log = getActionLog(action.type);

    const selCrit  = ctx.selCrit;

    // no-op for Cancel operation ... nothing left to do
    if (action.completionType === 'cancel') {
      dispatch();
      return;
    }

    // apply save (when requested) so as to have an up-to-date selCrit (with new dbHash, etc.)
    const resolveSelCritPromise = action.completionType === 'save'
           ? geekUFetch('/api/selCrit', { // TODO: consider utilizing an api utility for all service calls
               method: 'PUT',
               headers: {
                 'Content-Type': 'application/json'
               },
               body: JSON.stringify(selCrit)
             })
             .then( res => {
               const savedSelCrit = res.payload;
               log.debug(()=>`successful save of selCrit key: ${savedSelCrit.key}`);
               return savedSelCrit;
             })
           : Promise.resolve(selCrit);

    // emit selCrit.changed action ... once the selCrit has been fully resolved, and it has actually changed
    resolveSelCritPromise.then( selCrit => {

      if (selCrit.curHash !== ctx.startingCurHash || // selCrit has changed from our starting point -OR-
          action.completionType === 'save') {        // save actually updates selCrit (at minimum: dbHash) ... we want the latest
        dispatch( AC.selCrit.changed(selCrit) );
      }
      else {
        dispatch(); 
      }
    })
    .catch( err => {
      // report unexpected condition to user (logging details for tech reference)
      dispatch( handleUnexpectedError(err, `saving selCrit for key: ${selCrit.key}`) );
    });

  },

});



// ??? keep (seperate module)
const syncViewWhenSelCritChanged = createLogic({

  type: 'selCrit.changed',

  process({getState, action}, dispatch) {

    const log = getActionLog(action.type);

    const appState  = getState();
    const selCrit  = action.selCrit;

    // conditionally refresh view when based on this changed selCrit
    if (selectors.isSelCritActiveInView(appState, selCrit)) {
      log.debug(()=>`syncing view (issuing action: AC.itemsView) with changed selCrit: ${selCrit.name}`);
      dispatch( AC.itemsView(selCrit.itemType, selCrit, 'no-activate') );
    }
    else {
      dispatch();
    }

  },

});


export default [
  monitor_selCrit_edit,
  monitor_selCrit_edit_complete,
  syncViewWhenSelCritChanged
];
