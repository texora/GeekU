'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.studentsView.items reducer
// ***

const reductionHandler = new ReductionHandler('appState.studentsView.items', {

  [AT.selectStudentsView.retrieveComplete](items, action) {
    return [
      action.items,
      ()=>`set items from action: ${action.items.length} students`
    ];
  },

  [AT.detailStudent.retrieve.complete](items, action) {
    return [
      items.map( (student) => {
        return action.student.studentNum===student.studentNum ? action.student : student
      }),
      ()=>`patching detail student into items[] from action.student: ${action.student.studentNum}`
    ];
  },

  [AT.selCrit.delete.complete](items, action) {
    // sync when our view has been impacted by selCrit deletion
    if (action.impactView==='Students') {
      return [
        [],
        ()=>'clear items ([]) becase our view is based on deleted selCrit'
      ];
    }
    // no-sync when our view is not impacted by selCrit deletion
    else {
      return [
        items,
        ()=>'no change to items because our view is NOT based on deleted selCrit'
      ];
    }
  },

});

export default function items(items=[], action) {
  return reductionHandler.reduce(items, action);
}
