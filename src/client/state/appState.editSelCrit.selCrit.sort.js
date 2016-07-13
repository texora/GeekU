'use strict'

import {AT}            from './actions';
import ReduxSubReducer from '../util/ReduxSubReducer';


// ***
// *** appState.editSelCrit.selCrit.sort reducer
// ***

const subReducer = new ReduxSubReducer('appState.editSelCrit.selCrit.sort', {

  [AT.selCrit.edit.sortChange](sort, action) {
    const selectedSortOptions = action.selectedSortOptions;

    // sync selCrit.sort from selectedSortOptions
    const newSort = selectedSortOptions===null || selectedSortOptions.length===0
                      ? null
                      : selectedSortOptions.reduce( (sort, sortOption) => {
                          sort[sortOption.value] = sortOption.ascDec;
                          return sort;
                        }, {});
    return [
      newSort,
      ()=>`convert selectedSortOptions to selCrit.sort: ${JSON.stringify(newSort, null, 2)}`
    ];
  },

});

export default function sort(sort=null, action) {
  return subReducer.resolve(sort, action);
}
