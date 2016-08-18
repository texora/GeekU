'use strict'

import * as Redux from 'redux';

import userMsg      from './appState.userMsg';
import itemsView    from './appState.itemsView';
import filters      from './appState.filters';
import editSelCrit  from './appState.editSelCrit';

// ***
// *** our app's top-level reducer
// ***

const appState = Redux.combineReducers({
  userMsg,
  itemsView,
  filters,
  editSelCrit,
});
export default appState;
