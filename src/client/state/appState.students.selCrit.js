'use strict'

import * as Redux      from 'redux';
import {AT}            from './actions';
import ReduxSubReducer from '../util/ReduxSubReducer';
import crc             from 'crc';

import placebo  from './placeboReducer';
import name     from './appState.students.selCrit.name';
import fields   from './appState.students.selCrit.fields';
import editing  from './appState.students.selCrit.editing';


// ***
// *** appState.students.selCrit reducer
// ***

// NOTE: This is a hybrid reducer with ability to maintain both 
//         1) the top-level (selCrit) and 
//         2) the individual fields (e.g. selCrit.filter).

const _selCrit = Redux.combineReducers({

  name,
  desc:   placebo,
  target: placebo,

  fields,
  sort:   placebo,
  distinguishMajorSortField: placebo,
  filter: placebo,

  editing,
  dbHash:   placebo,
  editHash: placebo,
});

const subReducer = new ReduxSubReducer('appState.students.selCrit', {

  [AT.retrieveStudents.complete](selCrit, action) {
    const nextSelCrit = action.selCrit;
    return [
      nextSelCrit,
      ()=>'set selCrit from action ... ' + JSON.stringify(nextSelCrit, null, 2)
    ];
  },

});

export default function selCrit(selCrit={}, action) {

  // invoke BOTH 1) our top-level selCrit reducer, and 2) our individual fields reducers
  const nextSelCrit = _selCrit(subReducer.resolve(selCrit, action),
                               action);

  // additional value-added logic follows ...

  // when the selCrit has changed, maintain it's editHash
  if (nextSelCrit !== selCrit) {
    nextSelCrit.editHash = hashSelCrit(nextSelCrit);
  }

  return nextSelCrit;
}

export function hashSelCrit(selCrit) {
  const selCritStr = JSON.stringify(selCrit, (key, value) => {
    if (key === 'editing' || key === 'editHash' || key === 'dbHash')
      return undefined; // omit non-persistent attributes
    return value;
  });
  return crc.crc32(selCritStr).toString(16);
}
