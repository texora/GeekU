'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.editSelCrit.extra.selCritIsNew reducer
// ***

const reductionHandler = new ReductionHandler('appState.editSelCrit.extra.selCritIsNew', {

  [AT.selCrit.edit](selCritIsNew, action) {
    return [
      action.selCritIsNew,
      ()=>'set selCritIsNew from action'
    ];
  },

});

export default function selCritIsNew(selCritIsNew=false, action) {
  return reductionHandler.reduce(selCritIsNew, action);
}
