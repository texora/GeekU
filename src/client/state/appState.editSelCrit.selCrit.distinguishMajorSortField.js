'use strict'

import {AT}            from './actions';
import ReduxSubReducer from '../util/ReduxSubReducer';


// ***
// *** appState.editSelCrit.selCrit.distinguishMajorSortField reducer
// ***

const subReducer = new ReduxSubReducer('appState.editSelCrit.selCrit.distinguishMajorSortField', {

  [AT.selCrit.edit.distinguishMajorSortFieldChange](distinguishMajorSortField, action) {
    return [
      action.value,
      ()=>`set name from action.value: ${action.value}`
    ];
  },

});

export default function distinguishMajorSortField(distinguishMajorSortField=null, action) {
  return subReducer.resolve(distinguishMajorSortField, action);
}
