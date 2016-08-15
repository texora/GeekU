'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.studentsView.selectedStudent reducer
// ***

const reductionHandler = new ReductionHandler('appState.studentsView.selectedStudent', {

  [AT.selectStudent](selectedStudent, action) {
    return [
      action.student,
      ()=>'set selectedStudent from action.student ... ' + FMT(action.student)
    ];
  },

  [AT.selectStudentsView.retrieveComplete] (selectedStudent, action) {
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

  [AT.selCrit.delete.complete](selectedStudent, action) {
    // sync when our view has been impacted by selCrit deletion
    if (action.impactView==='Students') {
      return [
        null,
        ()=>'clear selectedStudent becase our view is based on deleted selCrit'
      ];
    }
    // no-sync when our view is not impacted by selCrit deletion
    else {
      return [
        selectedStudent,
        ()=>'no change to selectedStudent because our view is NOT based on deleted selCrit'
      ];
    }
  },

});

export default function selectedStudent(selectedStudent=null, action) {
  return reductionHandler.reduce(selectedStudent, action);
}
