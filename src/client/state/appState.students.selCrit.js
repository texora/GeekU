'use strict'

import {AT}            from './actions';
import ReduxSubReducer from '../util/ReduxSubReducer';


// ***
// *** appState.students.selCrit reducer
// ***

const subReducer = new ReduxSubReducer('appState.students.selCrit', {

  [AT.retrieveStudents.complete](selCrit, action) {
    return [
      action.selCrit,
      ()=>'set selCrit from action ... ' + JSON.stringify(action.selCrit, null, 2)
    ];
  },

});

export default function selCrit(selCrit={}, action) {
  return subReducer.resolve(selCrit, action);
}
