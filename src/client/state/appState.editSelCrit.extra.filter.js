'use strict'

import {AT}             from './actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.editSelCrit.extra.filter reducer
// ***

const reductionHandler = new ReductionHandler('appState.editSelCrit.extra.filter', {

  [AT.selCrit.edit](filter, action) {

    // convert selCrit.filter to our internal "extra" filter representation
    const meta        = action.meta;
    const extraFilter = (action.selCrit.filter || []).map( selCritFilter => {
      return {
        field: selCritFilter.field,
        op:    selCritFilter.op,
        value: selCritFilter.value
      };
    });

    return [
      extraFilter,
      ()=>`convert selCrit.filter to "extra" filter: ${JSON.stringify(extraFilter, null, 2)}`
    ];
  },

  [AT.selCrit.edit.filterChange](filter, action) {
    return [
      action.extraFilter,
      ()=>`set "extra" filter from action.extraFilter: ${JSON.stringify(action.extraFilter, null, 2)}`
    ];
  },

});

export default function filter(filter=[], action) {
  return reductionHandler.reduce(filter, action);
}
