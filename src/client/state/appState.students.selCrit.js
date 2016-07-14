'use strict'

import * as Redux      from 'redux';
import {AT}            from './actions';
import ReduxSubReducer from '../util/ReduxSubReducer';


// ***
// *** appState.students.selCrit reducer
// ***

const subReducer = new ReduxSubReducer('appState.students.selCrit', {

  [AT.retrieveStudents.complete](selCrit, action) {
    const nextSelCrit = action.selCrit;
    return [
      nextSelCrit,
      ()=>'set selCrit from action ... ' + JSON.stringify(nextSelCrit, null, 2)
    ];
  },

});

export default function selCrit(selCrit=null, action) {
  return subReducer.resolve(selCrit, action);
}
