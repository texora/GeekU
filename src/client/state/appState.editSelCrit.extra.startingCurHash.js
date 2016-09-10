'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.editSelCrit.extra.startingCurHash reducer
// ***

const reductionHandler = new ReductionHandler('appState.editSelCrit.extra.startingCurHash', {

  [AT.selCrit.edit](startingCurHash, action) {
    return [
      action.selCrit.curHash,
      ()=>'set startingCurHash from action.selCrit.curHash'
    ];
  },

});

export default function startingCurHash(startingCurHash=null, action) {
  return reductionHandler.reduce(startingCurHash, action);
}
