'use strict'

import * as Redux       from 'redux';
import {AT}             from './actions';
import ReductionHandler from '../util/ReductionHandler';

import selectedFieldOptions from './appState.editSelCrit.extra.selectedFieldOptions';
import selectedSortOptions  from './appState.editSelCrit.extra.selectedSortOptions';

// ***
// *** appState.editSelCrit.extra reducer
// ***

// NOTE: This is a hybrid reducer with ability to maintain both 
//         1) the top-level (extra) and 
//         2) the individual fields being edited

const _extra = Redux.combineReducers({
  selectedFieldOptions,
  selectedSortOptions,
});

const reductionHandler = new ReductionHandler('appState.editSelCrit.extra', {

  [AT.selCrit.edit](extra, action) {
    return [
      {},
      ()=>'set extra to new structure'
    ];
  },

  [AT.selCrit.edit.close](extra, action) {
    return [
      null,
      ()=>'set extra to null'
    ];
  },

});

export default function extra(extra=null, action) {

  // invoke our top-level extra reducer
  let nextExtra = reductionHandler.reduce(extra, action);

  // short-circuit further reduction, when NO edit session is active
  // ... our extra is null (it has no fields)
  if (nextExtra===null) {
    return nextExtra;
  }

  // invoke our our individual fields reducers
  nextExtra = _extra(nextExtra, action);

  return nextExtra;
}
