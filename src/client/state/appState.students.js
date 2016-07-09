'use strict'

import * as Redux from 'redux';

import selectedStudent from './appState.students.selectedStudent';
import detailStudent   from './appState.students.detailStudent';
import detailEditMode  from './appState.students.detailEditMode';
import inProgress      from './appState.students.inProgress';
import selCrit         from './appState.students.selCrit';
import items           from './appState.students.items';


// ***
// *** appState.students reducer
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
