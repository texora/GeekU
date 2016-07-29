'use strict'

import {AT}             from './actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.editSelCrit.selCrit.filter reducer
// ***

const reductionHandler = new ReductionHandler('appState.editSelCrit.selCrit.filter', {

  [AT.selCrit.edit.filterChange](filter, action) {

    const extraFilter = action.extraFilter;

    // sync selCrit.filter from extraFilter
    const newFilter = extraFilter===null || extraFilter.length===0
                        ? null
                        : extraFilter.map( extraFilterObj => {
                            return {
                              field: extraFilterObj.field,
                              op:    extraFilterObj.op,
                              value: extraFilterObj.value
                            };
                          });
    return [
      newFilter,
      ()=>`convert action.extraFilter to selCrit.filter: ${JSON.stringify(newFilter, null, 2)}`
    ];
  },

});

export default function filter(filter='', action) {
  return reductionHandler.reduce(filter, action);
}
