'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.filters reducer
// ***

const reductionHandler = new ReductionHandler('appState.filters', {

  [AT.retrieveFilters.complete](filters, action) {
    return [
      action.filters,
      ()=>`set filters from action.filters: '${action.filters}'`
    ];
  },

  [AT.selCrit.edit.changed]:  sharedSync,
  [AT.selCrit.save.complete]: sharedSync,

  [AT.selCrit.delete.complete](filters, action) {
    const prunedFilters = filters.prune( selCrit => selCrit.key===action.selCrit.key );
    return [
      prunedFilters,
      ()=>`pruned filters with action.selCrit.key: '${action.selCrit.key}'`
    ];
  },

});

function sharedSync(filters, action) { // requires action.selCrit
  const changedSelCrit = action.selCrit;
  let   isNewEntry = true;
  const newFilters = filters.map( (selCrit) => {
    if (selCrit.key===changedSelCrit.key) {
      isNewEntry = false;
      return changedSelCrit;
    }
    else {
      return selCrit;
    }
  });
  if (isNewEntry) {
    newFilters.push(changedSelCrit);
  }
  return [
    newFilters,
    ()=>`sync filters with changed action.selCrit: '${FMT(action.selCrit)}'`
  ];
}

export default function filters(filters=[], action) {

  // invoke our normal reducer
  const nextState = reductionHandler.reduce(filters, action);

  //***
  //*** additional value-added logic follows ...
  //***

  // when our state has changed, maintain it's sort order
  if (nextState !== filters) {
    nextState.sort( (sc1, sc2) => {
      return sc1.itemType.localeCompare(sc2.itemType) ||
             sc1.name    .localeCompare(sc2.name)   ||
             sc1.desc    .localeCompare(sc2.desc);
    });
  }

  return nextState;
}


//***
//*** Selectors ...
//***

export const getFilters = (filters) => filters;
