'use strict'

import {AT}             from './actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.students.selCrit reducer
// ***

const reductionHandler = new ReductionHandler('appState.students.selCrit', {

  [AT.retrieveStudents.complete](selCrit, action) {
    const nextSelCrit = action.selCrit;
    return [
      nextSelCrit,
      ()=>'set selCrit from action ... ' + JSON.stringify(nextSelCrit, null, 2)
    ];
  },

});

export default function selCrit(selCrit=null, action) {
  return reductionHandler.reduce(selCrit, action);
}
