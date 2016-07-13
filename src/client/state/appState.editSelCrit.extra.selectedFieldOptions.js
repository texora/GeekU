'use strict'

import {AT}            from './actions';
import ReduxSubReducer from '../util/ReduxSubReducer';


// ***
// *** appState.editSelCrit.extra.selectedFieldOptions reducer
// ***

const subReducer = new ReduxSubReducer('appState.editSelCrit.extra.selectedFieldOptions', {

  [AT.selCrit.edit](selectedFieldOptions, action) {

    // convert selCrit.fields to selectedFieldOptions
    const meta   = action.meta;
    const fields = action.selCrit.fields || [];

    const newSelectedFieldOptions = fields.map( (fieldName) => {
      return {
        value:  fieldName,
        label:  meta.validFields[fieldName]
      };
    });
    
    return [
      newSelectedFieldOptions,
      ()=>`convert selCrit.field to selectedFieldOptions: ${JSON.stringify(newSelectedFieldOptions, null, 2)}`
    ];
  },

  [AT.selCrit.edit.fieldsChange](selectedFieldOptions, action) {
    return [
      action.selectedFieldOptions,
      ()=>`set selectedFieldOptions from action.selectedFieldOptions: ${JSON.stringify(action.selectedFieldOptions, null, 2)}`
    ];
  },

});

export default function selectedFieldOptions(selectedFieldOptions=[], action) {
  return subReducer.resolve(selectedFieldOptions, action);
}
