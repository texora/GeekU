'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.editSelCrit.extra.isNew reducer
// ***

const reductionHandler = new ReductionHandler('appState.editSelCrit.extra.isNew', {

  [AT.selCrit.edit](isNew, action) {
    return [
      action.isNew,
      ()=>'set isNew from action'
    ];
  },

});

export default function isNew(isNew=false, action) {
  return reductionHandler.reduce(isNew, action);
}
