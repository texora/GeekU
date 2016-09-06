'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.itemsView.itemType.selCrit reducer (function wrapper)
// ***

// NOTE: This module promotes a reducer function wrapper (with
//       _itemType state), which in turn returns the reducer function.

export default function selCrit(_itemType) {

  const reductionHandler = new ReductionHandler(`appState.itemsView.${_itemType}.selCrit`, {

    [AT.itemsView.retrieveComplete](selCrit, action) {
      return [
        action.selCrit,
        ()=>`set selCrit from action ... ${FMT(action.selCrit)}`
      ];
    },

    [AT.selCrit.delete.complete](selCrit, action) {
      // sync when our view has been impacted by selCrit deletion
      if (action.impactView===_itemType) {
        return [
          null,
          ()=>'clear selCrit becase our view is based on deleted selCrit'
        ];
      }
      // no-sync when our view is not impacted by selCrit deletion
      // ?? test ... with enhacement to ReductionHandler, we can OMIT THIS
      else {
        return [
          selCrit,
          ()=>'no change to selCrit'
        ];
      }
    },
    
  });
  
  return function selCrit(selCrit=null, action) {
    return reductionHandler.reduce(selCrit, action);
  }

}


//***
//*** Selectors ...
//***

export const getItemsViewSelCrit = (selCrit) => selCrit || {name: 'please', desc: 'select a filter from the Left Nav menu'};
