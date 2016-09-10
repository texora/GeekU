'use strict'

import * as Redux       from 'redux';
import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';
import SelCrit          from '../../shared/domain/SelCrit';

import placebo  from './placeboReducer';
import name     from './appState.editSelCrit.selCrit.name';
import desc     from './appState.editSelCrit.selCrit.desc';
import fields   from './appState.editSelCrit.selCrit.fields';
import sort     from './appState.editSelCrit.selCrit.sort';
import filter   from './appState.editSelCrit.selCrit.filter';
import distinguishMajorSortField from './appState.editSelCrit.selCrit.distinguishMajorSortField';


// ***
// *** appState.editSelCrit.selCrit reducer
// ***

// NOTE: This is a hybrid reducer with ability to maintain both 
//         1) the top-level (selCrit) and 
//         2) the individual fields being edited (e.g. selCrit.filter, etc.)

const _selCrit = Redux.combineReducers({
  _id:      placebo,
  key:      placebo,
  userId:   placebo,
  itemType: placebo,
  lastDbModDate: placebo,

  name,
  desc,

  fields,
  sort,
  distinguishMajorSortField,
  filter,

  dbHash:  placebo,
  curHash: placebo,
});

const reductionHandler = new ReductionHandler('appState.editSelCrit.selCrit', {

  [AT.selCrit.edit](selCrit, action) {
    return [
      action.selCrit,
      ()=>'set selCrit from action ... ' + FMT(action.selCrit)
    ];
  },

  [AT.selCrit.edit.complete](selCrit, action) {
    return [
      null,
      ()=>'set selCrit to null'
    ];
  },

});

export default function selCrit(selCrit=null, action) {

  // invoke our top-level selCrit reducer
  let nextSelCrit = reductionHandler.reduce(selCrit, action);

  // short-circuit further reduction, when NO edit session is active
  // ... our selCrit is null (it has no fields)
  if (nextSelCrit===null) {
    return nextSelCrit;
  }

  // invoke our our individual fields reducers
  nextSelCrit = _selCrit(nextSelCrit, action);

  
  //***
  //*** additional value-added logic follows ...
  //***

  // when the selCrit has changed, maintain it's curHash
  if (nextSelCrit !== selCrit) {
    const fromHash = nextSelCrit.curHash;
    const toHash   = SelCrit.hash(nextSelCrit);

    nextSelCrit.curHash = toHash;

    reductionHandler.logStandardizedMsg(action,
                                        fromHash !== toHash,
                                        `value-added-logic (because selCrit changed): setting selCrit.curHash FROM: '${fromHash}', TO: '${toHash}'`);
  }

  return nextSelCrit;
}
