'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.editSelCrit.selCrit.desc reducer
// ***

const reductionHandler = new ReductionHandler('appState.editSelCrit.selCrit.desc', {

  [AT.selCrit.edit.change.desc](desc, action) {
    return [
      action.desc,
      ()=>`set desc from action.desc: ${action.desc}`
    ];
  },

});

export default function desc(desc='', action) {
  return reductionHandler.reduce(desc, action);
}
