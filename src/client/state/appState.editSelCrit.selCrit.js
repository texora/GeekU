'use strict'

import * as Redux      from 'redux';
import {AT}            from './actions';
import ReduxSubReducer from '../util/ReduxSubReducer';
import {hashSelCrit}   from '../util/selCritUtil';

import placebo  from './placeboReducer';
import name     from './appState.editSelCrit.selCrit.name';
import desc     from './appState.editSelCrit.selCrit.desc';
import fields   from './appState.editSelCrit.selCrit.fields';
import sort     from './appState.editSelCrit.selCrit.sort';


// ***
// *** appState.editSelCrit.selCrit reducer
// ***

// NOTE: This is a hybrid reducer with ability to maintain both 
//         1) the top-level (selCrit) and 
//         2) the individual fields being edited (e.g. selCrit.filter, etc.)

const _selCrit = Redux.combineReducers({

  // NOTE: The order of these field reducers is important to accomidate our
  //       "somewhat brittle" hash algorithm.
  //       Please maintain same order as found in selCritUtil.newStudentsSelCrit().

  key:    placebo,
  target: placebo,

  name,
  desc,

  fields,
  sort,
  distinguishMajorSortField: placebo,
  filter: placebo,

  dbHash:  placebo,
  curHash: placebo,
});

const subReducer = new ReduxSubReducer('appState.editSelCrit.selCrit', {

  [AT.selCrit.edit](selCrit, action) {
    const nextSelCrit = action.selCrit;
    return [
      nextSelCrit,
      ()=>'set selCrit from action ... ' + JSON.stringify(nextSelCrit, null, 2)
    ];
  },

  [AT.selCrit.edit.close](selCrit, action) {
    return [
      null,
      ()=>'set selCrit to null'
    ];
  },

});

export default function selCrit(selCrit=null, action) {

  // invoke our top-level selCrit reducer
  let nextSelCrit = subReducer.resolve(selCrit, action);

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
    const toHash   = hashSelCrit(nextSelCrit);
    const stateChangedMsg = fromHash === toHash ? '(*NO* state change)' : '(STATE CHANGED)';
    nextSelCrit.curHash = toHash;
    // ??? TODO:  need to standardize log entry for these value-added semantics
    subReducer.log.follow(()=>`Reducer: ${subReducer.reducerName}, Action: '${action.type}' ${stateChangedMsg} ... value-added-logic (because selCrit changed): setting selCrit.curHash FROM: '${fromHash}', TO: '${toHash}'`);
  }

  return nextSelCrit;
}
