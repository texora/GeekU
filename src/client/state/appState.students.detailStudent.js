'use strict'

import {AT}            from './actions';
import ReduxSubReducer from '../util/ReduxSubReducer';


// ***
// *** appState.students.detailStudent reducer
// ***

const subReducer = new ReduxSubReducer('appState.students.detailStudent', {

  [AT.detailStudent.retrieve.complete](detailStudent, action) {
    return [
      action.student,
      ()=>'set detailStudent from action.student ... ' + JSON.stringify(action.student, null, 2)
    ];
  },

  [AT.detailStudent.close](detailStudent, action) {
    return [
      null,
      ()=>'clearing detailStudent'
    ];
  },

});

export default function detailStudent(detailStudent=null, action) {
  return subReducer.resolve(detailStudent, action);
}
