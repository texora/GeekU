'use strict'

import * as Redux      from 'redux';

import selCrit             from './appState.editSelCrit.selCrit';
import extra               from './appState.editSelCrit.extra';


// ***
// *** appState.editSelCrit reducer
// ***

const editSelCrit = Redux.combineReducers({
  selCrit,
  extra, // additional temporal structure streamlining various UI components
});

export default editSelCrit;


//***
//*** Selectors ...
//***

export const getEditSelCrit = (editSelCrit) => editSelCrit;
