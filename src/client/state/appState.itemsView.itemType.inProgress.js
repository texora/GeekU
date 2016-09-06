'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.itemsView.itemType.inProgress reducer (function wrapper)
// ***

// NOTE: This module promotes a reducer function wrapper (with
//       _itemType state), which in turn returns the reducer function.

export default function inProgress(_itemType) {

  const reductionHandler = new ReductionHandler(`appState.itemsView.${_itemType}.inProgress`, {

    [AT.itemsView.retrieveStart]    (inProgress, action) { return addIn(inProgress, +1); },
    [AT.itemsView.retrieveComplete] (inProgress, action) { return addIn(inProgress, -1); },
    [AT.itemsView.retrieveFail]     (inProgress, action) { return addIn(inProgress, -1); },
    
  });
  
  return function inProgress(inProgress=0, action) {
    return reductionHandler.reduce(inProgress, action);
  }

}

function addIn(val, additive) {
  let newVal = val + additive;
  if (newVal < 0)
    newVal = 0; // never let it go negative ... even if we have something out of sync
  return [newVal, ()=>`setting inProgress to: ${newVal}`];
}


//***
//*** Selectors ...
//***

export const isItemsViewInProgress = (inProgress) => inProgress ? true : false;
