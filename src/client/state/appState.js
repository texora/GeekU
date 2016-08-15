'use strict'

import * as Redux from 'redux';

import userMsg      from './appState.userMsg';
import selectedView from './appState.selectedView';
import studentsView from './appState.studentsView';
import filters      from './appState.filters';
import editSelCrit  from './appState.editSelCrit';

// ***
// *** our app's top-level reducer
// ***

const appState = Redux.combineReducers({
  userMsg,
  selectedView,
  studentsView,
  filters,
  editSelCrit,
});
export default appState;
