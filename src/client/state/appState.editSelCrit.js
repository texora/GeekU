'use strict'

import * as Redux      from 'redux';

import selCrit             from './appState.editSelCrit.selCrit';
import editCompleteExtraCb from './appState.editSelCrit.editCompleteExtraCb';
import extra               from './appState.editSelCrit.extra';


// ***
// *** appState.editSelCrit reducer
// ***

const editSelCrit = Redux.combineReducers({
  selCrit,
  editCompleteExtraCb,
  extra, // additional temporal structure streamlining various UI components
});

export default editSelCrit;
