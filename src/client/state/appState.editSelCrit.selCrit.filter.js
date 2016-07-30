'use strict'

import {AT}             from './actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.editSelCrit.selCrit.filter reducer
// ***

const reductionHandler = new ReductionHandler('appState.editSelCrit.selCrit.filter', {

  [AT.selCrit.edit.filterChange](filter, action) {

    // sync selCrit.filter from action.newFilter
    const newFilter = action.newFilter===null || action.newFilter.length===0
                        ? null
                        : action.newFilter.map( newFilterObj => {
                            return {
                              field: newFilterObj.field,
                              op:    newFilterObj.op,
                              value: newFilterObj.value
                            };
                          });
    return [
      newFilter,
      ()=>`convert action.newFilter to selCrit.filter: ${FMT(newFilter)}`
    ];
  },

});

export default function filter(filter='', action) {
  return reductionHandler.reduce(filter, action);
}
