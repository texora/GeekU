'use strict'

import {AT}            from './actions';
import ReduxSubReducer from '../util/ReduxSubReducer';


// ***
// *** appState.editSelCrit.extra.filter reducer
// ***

const subReducer = new ReduxSubReducer('appState.editSelCrit.extra.filter', {

  [AT.selCrit.edit](filter, action) {

    // convert selCrit.filter to our internal "extra" filter representation
    const meta        = action.meta;
    const filterSrc   = action.selCrit.filter || {};
    const extraFilter = [];

    for (const fieldName in filterSrc) {
      // console.log(`xx fieldName: ${fieldName}`);
      const fieldVal = filterSrc[fieldName];
      // console.log(`xx fieldVal: `, fieldVal);
      let   op    = null;  // fieldVal object has ONE property - pull it out ... ex: {$gt: '3.65'} -or- {$in: ['MO', 'IN']}
      let   opVal = null;
      for (const fieldProp in fieldVal) {
        // console.log(`xx fieldProp: ${fieldProp}`);
        op = fieldProp;
        // console.log(`xx op: ${op}`);
        opVal = fieldVal[fieldProp]
      }
      // value: react-select-options CAN BE seeded with values array ONLY ... which matches the .value options ... {value: xxx, label: xxx}
      extraFilter.push({ fieldName, operator: op, value: opVal });
    }

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
  return subReducer.resolve(filter, action);
}
