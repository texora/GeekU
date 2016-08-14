'use strict'

import * as Redux from 'redux';

import selectedStudent from './appState.studentsView.selectedStudent';
import detailStudent   from './appState.studentsView.detailStudent';
import detailEditMode  from './appState.studentsView.detailEditMode';
import inProgress      from './appState.studentsView.inProgress';
import selCrit         from './appState.studentsView.selCrit';
import items           from './appState.studentsView.items';


// ***
// *** appState.studentsView reducer
// ***

const students = Redux.combineReducers({

  selectedStudent,

  detailStudent,
  detailEditMode,

  inProgress,
  selCrit,
  items,

});
export default students;
