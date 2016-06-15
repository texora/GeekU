'use strict'

import * as Redux from 'redux';

import selCrit from './appState.students.selCrit';
import items   from './appState.students.items';

// ***
// *** appState.students reducer
// ***

const students = Redux.combineReducers({
  selCrit,
  items,
});
export default students;
