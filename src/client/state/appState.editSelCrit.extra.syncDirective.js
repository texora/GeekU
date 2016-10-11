'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.editSelCrit.extra.syncDirective reducer
// ***

const reductionHandler = new ReductionHandler('appState.editSelCrit.extra.syncDirective', {

  [AT.selCrit.edit](syncDirective, action) {
    return [
      action.syncDirective,
      ()=>'set syncDirective from action'
    ];
  },

});

export default function syncDirective(syncDirective=false, action) {
  return reductionHandler.reduce(syncDirective, action);
}
