'use strict'

import * as Redux from 'redux';

import userMsg  from './appState.userMsg';
import students from './appState.students';

// ***
// *** our app's top-level reducer
// ***

const appState = Redux.combineReducers({
  userMsg,
  students,
});
export default appState;
