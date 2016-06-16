'use strict'

import {AT}            from './actions';
import ReduxSubReducer from '../util/ReduxSubReducer';


// ***
// *** appState.students.selectedStudent reducer
// ***

const subReducer = new ReduxSubReducer('appState.students.selectedStudent', {

  [AT.selectStudent](selectedStudent, action) {
    return [
      action.student,
      ()=>'set selectedStudent from action.student ... ' + JSON.stringify(action.student, null, 2)
    ];
  },

});

export default function selectedStudent(selectedStudent=null, action) {
  return subReducer.resolve(selectedStudent, action);
}
