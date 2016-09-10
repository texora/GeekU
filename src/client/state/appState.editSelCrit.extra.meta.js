'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.editSelCrit.extra.meta reducer
// ***

const reductionHandler = new ReductionHandler('appState.editSelCrit.extra.meta', {

  [AT.selCrit.edit](meta, action) {
    return [
      action.meta,
      ()=>'set meta from action'
    ];
  },

});

export default function meta(meta={}, action) {
  return reductionHandler.reduce(meta, action);
}
