'use strict'

import {AT}             from './actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.students.selectedStudent reducer
// ***

const reductionHandler = new ReductionHandler('appState.students.selectedStudent', {

  [AT.selectStudent](selectedStudent, action) {
    return [
      action.student,
      ()=>'set selectedStudent from action.student ... ' + FMT(action.student)
    ];
  },

  [AT.retrieveStudents.complete] (selectedStudent, action) {
    return [
      null,
      ()=>'de-selecting selectedStudent on new retrieval'
    ];
  },

  [AT.detailStudent.retrieve.complete](selectedStudent, action) {
    return [
      action.student,
      ()=>'set selectedStudent from action.student ... ' + FMT(action.student)
    ];
  },

});

export default function selectedStudent(selectedStudent=null, action) {
  return reductionHandler.reduce(selectedStudent, action);
}
