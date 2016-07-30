'use strict'

import {AT}             from './actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.editSelCrit.selCrit.fields reducer
// ***

const reductionHandler = new ReductionHandler('appState.editSelCrit.selCrit.fields', {

  [AT.selCrit.edit.fieldsChange](fields, action) {
    const selectedFieldOptions = action.selectedFieldOptions;

    // sync selCrit.fields from selectedFieldOptions
    const newFields = selectedFieldOptions===null || selectedFieldOptions.length===0
                        ? null
                        : selectedFieldOptions.map( (fieldOption) => fieldOption.value );
    return [
      newFields,
      ()=>`convert selectedFieldOptions to selCrit.fields: ${FMT(newFields)}`
    ];
  },

});

export default function fields(fields=null, action) {
  return reductionHandler.reduce(fields, action);
}
