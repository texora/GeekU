'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.editSelCrit.selCrit.sort reducer
// ***

const reductionHandler = new ReductionHandler('appState.editSelCrit.selCrit.sort', {

  [AT.selCrit.edit.change.sort](sort, action) {
    const selectedSortOptions = action.selectedSortOptions;

    // sync selCrit.sort from selectedSortOptions
    const newSort = selectedSortOptions===null || selectedSortOptions.length===0
                     ? null
                     : selectedSortOptions.map( sortOption => `${sortOption.ascDec === -1 ? '-' : ''}${sortOption.value}` );
    return [
      newSort,
      ()=>`convert selectedSortOptions to selCrit.sort: ${FMT(newSort)}`
    ];
  },

});

export default function sort(sort=null, action) {
  return reductionHandler.reduce(sort, action);
}
