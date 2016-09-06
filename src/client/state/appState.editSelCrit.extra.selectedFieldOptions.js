'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';
import itemTypes        from '../../shared/domain/itemTypes';


// ***
// *** appState.editSelCrit.extra.selectedFieldOptions reducer
// ***

const reductionHandler = new ReductionHandler('appState.editSelCrit.extra.selectedFieldOptions', {

  [AT.selCrit.edit](selectedFieldOptions, action) {

    // convert selCrit.fields to selectedFieldOptions
    const meta   = itemTypes.meta[action.selCrit.itemType];
    const fields = action.selCrit.fields || [];

    const newSelectedFieldOptions = fields.map( (field) => {
      return {
        value:  field,
        label:  meta.validFields[field]
      };
    });
    
    return [
      newSelectedFieldOptions,
      ()=>`convert selCrit.field to selectedFieldOptions: ${FMT(newSelectedFieldOptions)}`
    ];
  },

  [AT.selCrit.edit.fieldsChange](selectedFieldOptions, action) {
    return [
      action.selectedFieldOptions,
      ()=>`set selectedFieldOptions from action.selectedFieldOptions: ${FMT(action.selectedFieldOptions)}`
    ];
  },

});

export default function selectedFieldOptions(selectedFieldOptions=[], action) {
  return reductionHandler.reduce(selectedFieldOptions, action);
}
