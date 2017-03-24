import {AT}           from '../actions';
import {reducerHash}  from 'astx-redux-util';
import Log            from '../../shared/util/Log';

// ***
// *** appState.itemsView.itemType.inProgress reducer (function wrapper)
// ***

// NOTE: This module promotes a reducer function wrapper (with
//       _itemType state), which in turn returns the reducer function.

export default function inProgress(_itemType) {

  const log = new Log(`appState.itemsView.${_itemType}.inProgress`);

  return reducerHash.withLogging(log, {
    [AT.itemsView.retrieve]:          (inProgress, action) => addIn(inProgress, +1),
    [AT.itemsView.retrieve.complete]: (inProgress, action) => addIn(inProgress, -1),
    [AT.itemsView.retrieve.fail]:     (inProgress, action) => addIn(inProgress, -1),
  }, 0); // initialState

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
