'use strict'

import * as Redux       from 'redux';
import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';

import isNew                from './appState.editSelCrit.extra.isNew';
import meta                 from './appState.editSelCrit.extra.meta';
import fieldOptions         from './appState.editSelCrit.extra.fieldOptions';
import selectedFieldOptions from './appState.editSelCrit.extra.selectedFieldOptions';
import sortOptions          from './appState.editSelCrit.extra.sortOptions';
import selectedSortOptions  from './appState.editSelCrit.extra.selectedSortOptions';
import startingCurHash      from './appState.editSelCrit.extra.startingCurHash';
import syncDirective        from './appState.editSelCrit.extra.syncDirective';


// ***
// *** appState.editSelCrit.extra reducer
// ***

// NOTE: This is a hybrid reducer with ability to maintain both 
//         1) the top-level (extra) and 
//         2) the individual fields being edited

const _extra = Redux.combineReducers({
  isNew,
  syncDirective,
  meta,
  fieldOptions,
  selectedFieldOptions,
  sortOptions,
  selectedSortOptions,
  startingCurHash,
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
