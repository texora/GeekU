'use strict'

import {AT}            from './actions';
import ReduxSubReducer from '../util/ReduxSubReducer';


// ***
// *** appState.students.hoveredStudent reducer
// ***

const subReducer = new ReduxSubReducer('appState.students.hoveredStudent', {

  [AT.hoverStudent](hoveredStudent, action) {
    return [
      action.student,
      ()=>'set hoveredStudent from action.student ... ' + JSON.stringify(action.student, null, 2)
    ];
  },

  [AT.detailStudent.retrieve.complete](hoveredStudent, action) {
    return [
      action.student,
      ()=>'set hoveredStudent from action.student ... ' + JSON.stringify(action.student, null, 2)
    ];
  },

});

export default function hoveredStudent(hoveredStudent=null, action) {
  return subReducer.resolve(hoveredStudent, action);
}
