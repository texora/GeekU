'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.editSelCrit.extra.sortOptions reducer
// ***

const reductionHandler = new ReductionHandler('appState.editSelCrit.extra.sortOptions', {

  [AT.selCrit.edit](sortOptions, action) {
    return [
      action.sortOptions,
      ()=>'set sortOptions from action'
    ];
  },

});

export default function sortOptions(sortOptions=[], action) {
  return reductionHandler.reduce(sortOptions, action);
}
