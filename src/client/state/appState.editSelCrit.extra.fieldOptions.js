'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.editSelCrit.extra.fieldOptions reducer
// ***

const reductionHandler = new ReductionHandler('appState.editSelCrit.extra.fieldOptions', {

  [AT.selCrit.edit](fieldOptions, action) {
    return [
      action.fieldOptions,
      ()=>'set fieldOptions from action'
    ];
  },

});

export default function fieldOptions(fieldOptions=[], action) {
  return reductionHandler.reduce(fieldOptions, action);
}
