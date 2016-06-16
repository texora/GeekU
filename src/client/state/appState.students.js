'use strict'

import * as Redux from 'redux';

import selCrit         from './appState.students.selCrit';
import selectedStudent from './appState.students.selectedStudent';
import items           from './appState.students.items';


// ***
// *** appState.students reducer
// ***

const students = Redux.combineReducers({
  selCrit,
  selectedStudent,
  items,
});
export default students;
