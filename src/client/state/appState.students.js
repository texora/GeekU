'use strict'

import * as Redux from 'redux';

import arr     from './appState.students.arr';
import selCrit from './appState.students.selCrit';

// ***
// *** appState.students reducer
// ***

const students = Redux.combineReducers({
  selCrit,
  arr,
});
export default students;
