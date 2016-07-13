'use strict'

import {AT}            from './actions';
import ReduxSubReducer from '../util/ReduxSubReducer';


// ***
// *** appState.editSelCrit.selCrit.fields reducer
// ***

const subReducer = new ReduxSubReducer('appState.editSelCrit.selCrit.fields', {

  [AT.selCrit.edit.fieldsChange](fields, action) {
    const selectedFieldOptions = action.selectedFieldOptions;

    // sync selCrit.fields from selectedFieldOptions
    const newFields = selectedFieldOptions===null || selectedFieldOptions.length===0
                        ? null
                        : selectedFieldOptions.map( (fieldOption) => fieldOption.value );
    return [
      newFields,
      ()=>`convert selectedFieldOptions to selCrit.fields: ${JSON.stringify(newFields, null, 2)}`
    ];
  },

});

export default function fields(fields=null, action) {
  return subReducer.resolve(fields, action);
}
