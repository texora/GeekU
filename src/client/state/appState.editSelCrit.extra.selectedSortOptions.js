'use strict'

import {AT}             from './actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.editSelCrit.extra.selectedSortOptions reducer
// ***

const reductionHandler = new ReductionHandler('appState.editSelCrit.extra.selectedSortOptions', {

  [AT.selCrit.edit](selectedSortOptions, action) {

    // convert selCrit.sort to selectedSortOptions
    const meta = action.meta;
    const sort = action.selCrit.sort || {};
    const newSelectedSortOptions = [];
    for (const fieldName in sort) {
      newSelectedSortOptions.push({ 
        value:  fieldName,
        label:  meta.validFields[fieldName],
        ascDec: sort[fieldName]
      });
    }

    return [
      newSelectedSortOptions,
      ()=>`convert selCrit.sort to selectedSortOptions: ${JSON.stringify(newSelectedSortOptions, null, 2)}`
    ];
  },

  [AT.selCrit.edit.sortChange](selectedSortOptions, action) {
    return [
      action.selectedSortOptions,
      ()=>`set selectedSortOptions from action.selectedSortOptions: ${JSON.stringify(action.selectedSortOptions, null, 2)}`
    ];
  },

});

export default function selectedSortOptions(selectedSortOptions=[], action) {
  return reductionHandler.reduce(selectedSortOptions, action);
}
