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

    [AT.detailStudent.retrieve.complete](detailItem, action) {
      return [
        action.student,
        ()=>'set detailStudent from action.student ... ' + FMT(action.student)
      ];
    },

    [AT.detailStudent.close](detailItem, action) {
      return [
        null,
        ()=>'clearing detailStudent'
      ];
    },
    
  });
  
  return function detailItem(detailItem=null, action) {
    return reductionHandler.reduce(detailItem, action);
  }

}
