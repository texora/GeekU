'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.itemsView.itemType.detailItem reducer (function wrapper)
// ***

// NOTE: This module promotes a reducer function wrapper (with
//       _itemType state), which in turn returns the reducer function.

export default function detailItem(_itemType) {

  const reductionHandler = new ReductionHandler(`appState.itemsView.${_itemType}.detailItem`, {

    [AT.detailItem.retrieve.complete](detailItem, action) {
      return [
        action.item,
        ()=>'set detailItem from action.item ... ' + FMT(action.item)
      ];
    },

    [AT.detailItem.close](detailItem, action) {
      return [
        null,
        ()=>'clearing detailItem'
      ];
    },
    
  });
  
  return function detailItem(detailItem=null, action) {
    return reductionHandler.reduce(detailItem, action);
  }

}


//***
//*** Selectors ...
//***

export const getItemsViewDetailItem = (detailItem) => detailItem;
