'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.editSelCrit.selCrit.distinguishMajorSortField reducer
// ***

const reductionHandler = new ReductionHandler('appState.editSelCrit.selCrit.distinguishMajorSortField', {

  [AT.selCrit.edit.distinguishMajorSortFieldChange](distinguishMajorSortField, action) {
    return [
      action.value,
      ()=>`set name from action.value: ${action.value}`
    ];
  },

});

export default function distinguishMajorSortField(distinguishMajorSortField=null, action) {
  return reductionHandler.reduce(distinguishMajorSortField, action);
}
