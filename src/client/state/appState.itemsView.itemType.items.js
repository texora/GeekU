'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';
import itemTypes        from '../../shared/model/itemTypes';


// ***
// *** appState.itemsView.itemType.items reducer (function wrapper)
// ***

// NOTE: This module promotes a reducer function wrapper (with
//       _itemType state), which in turn returns the reducer function.

export default function items(_itemType) {

  const reductionHandler = new ReductionHandler(`appState.itemsView.${_itemType}.items`, {

    [AT.itemsView.retrieveComplete](items, action) {
      return [
        action.items,
        ()=>`set items from action: ${action.items.length} ${itemTypes.meta[action.itemType].label.plural}`
      ];
    },

    [AT.detailItem.retrieveComplete](items, action) {
      const keyField = itemTypes.meta[action.itemType].keyField;
      return [
        items.map( (item) => {
          return action.item[keyField]===item[keyField] ? action.item : item
        }),
        ()=>`patching detail item into items[] from action.item: ${action.item[keyField]}`
      ];
    },

    [AT.selCrit.delete.complete](items, action) {
      // sync when our view has been impacted by selCrit deletion
      if (action.impactView===_itemType) {
        return [
          [],
          ()=>'clear items ([]) becase our view is based on deleted selCrit'
        ];
      }
      // no-sync when our view is not impacted by selCrit deletion
      // ?? test ... with enhacement to ReductionHandler, we can OMIT THIS
      else {
        return [
          items,
          ()=>'no change to items because our view is NOT based on deleted selCrit'
        ];
      }
    },
    
  });
  
  return function items(items=[], action) {
    return reductionHandler.reduce(items, action);
  }

}
