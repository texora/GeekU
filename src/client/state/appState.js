'use strict'

import * as Redux from 'redux';

import students from './appState.students';

// ***
// *** our app's top-level reducer
// ***

const appState = Redux.combineReducers({
  students,
});
export default appState;
