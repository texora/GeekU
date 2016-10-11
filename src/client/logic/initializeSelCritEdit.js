'use strict';

import createNamedLogic, * as LOGIC  from './util/createNamedLogic';
import SelCrit    from '../../shared/domain/SelCrit';
import itemTypes  from '../../shared/domain/itemTypes';
import {AT}       from '../actions';


/**
 * Initialize the AT.selCrit.edit action, which edits the supplied selCrit,
 * injecting additional information needed in action.
 */
export default createNamedLogic('initializeSelCritEdit', {

  type: AT.selCrit.edit.valueOf(),

  transform({ getState, action, log }, next) {

    const selCrit = action.selCrit;

    log.debug(()=> 'injecting additional information needed in action');

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
  },

});
