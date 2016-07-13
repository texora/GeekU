'use strict'

import * as Redux from 'redux';

import userMsg  from './appState.userMsg';
import mainPage from './appState.mainPage';
import students from './appState.students';
import editSelCrit from './appState.editSelCrit';

// ***
// *** our app's top-level reducer
// ***

const appState = Redux.combineReducers({
  userMsg,
  mainPage,
  students,
  editSelCrit,
});
export default appState;
