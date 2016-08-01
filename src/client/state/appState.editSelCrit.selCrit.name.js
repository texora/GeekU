'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.editSelCrit.selCrit.name reducer
// ***

const reductionHandler = new ReductionHandler('appState.editSelCrit.selCrit.name', {

  [AT.selCrit.edit.nameChange](name, action) {
    return [
      action.name,
      ()=>`set name from action.name: ${action.name}`
    ];
  },

});

export default function name(name='', action) {
  return reductionHandler.reduce(name, action);
}
