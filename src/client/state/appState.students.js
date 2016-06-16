'use strict'

import * as Redux from 'redux';

import inProgress      from './appState.students.inProgress';
import selCrit         from './appState.students.selCrit';
import selectedStudent from './appState.students.selectedStudent';
import items           from './appState.students.items';


// ***
// *** appState.students reducer
// ***

const students = Redux.combineReducers({
  inProgress,
  selCrit,
  selectedStudent,
  items,
});
export default students;
