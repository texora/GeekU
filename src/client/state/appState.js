'use strict'

import * as Redux from 'redux';

import userMsg     from './appState.userMsg';
import mainPage    from './appState.mainPage';
import filters     from './appState.filters';
import students    from './appState.students';
import editSelCrit from './appState.editSelCrit';

// ***
// *** our app's top-level reducer
// ***

const appState = Redux.combineReducers({
  userMsg,
  mainPage,
  filters,
  students,
  editSelCrit,
});
export default appState;
