'use strict'

import {AT}            from './actions';
import ReduxSubReducer from '../util/ReduxSubReducer';


// ***
// *** appState.editSelCrit.editCompleteExtraCb reducer
// ***

const subReducer = new ReduxSubReducer('appState.editSelCrit.editCompleteExtraCb', {

  [AT.selCrit.edit](editCompleteExtraCb, action) {
    return [
      action.editCompleteExtraCb,
      ()=>'set editCompleteExtraCb from action.editCompleteExtraCb'
    ];
  },

  [AT.selCrit.edit.complete](editCompleteExtraCb, action) {
    return [
      null,
      ()=>'set editCompleteExtraCb to null'
    ];
  },

});

export default function editCompleteExtraCb(editCompleteExtraCb=null, action) {
  return subReducer.resolve(editCompleteExtraCb, action);
}
