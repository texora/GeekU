'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.students.items reducer
// ***

const reductionHandler = new ReductionHandler('appState.students.items', {

  [AT.retrieveStudents.complete](items, action) {
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

});

export default function items(items=[], action) {
  return reductionHandler.reduce(items, action);
}
