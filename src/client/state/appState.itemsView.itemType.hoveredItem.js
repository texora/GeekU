'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';

// ***
// *** appState.itemsView.itemType.hoveredItem reducer (function wrapper)
// ***

// NOTE: This module promotes a reducer function wrapper (with
//       _itemType state), which in turn returns the reducer function.

export default function hoveredItem(_itemType) {

  const reductionHandler = new ReductionHandler(`appState.itemsView.${_itemType}.hoveredItem`, {

    [AT.hoverItem](hoveredItem, action) {
      return [
        action.item,
        ()=>`set hoveredItem from action.item: ${FMT(action.item)}`
      ];
    },
    
  });
  
  return function hoveredItem(hoveredItem=null, action) {
    return reductionHandler.reduce(hoveredItem, action);
  }

}


//***
//*** Selectors ...
//***

export const getItemsViewHoveredItem = (hoveredItem) => hoveredItem;
