'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.itemsView.itemType.detailEditMode reducer (function wrapper)
// ***

// NOTE: This module promotes a reducer function wrapper (with
//       _itemType state), which in turn returns the reducer function.

export default function detailEditMode(_itemType) {

  const reductionHandler = new ReductionHandler(`appState.itemsView.${_itemType}.detailEditMode`, {

    [AT.detailStudent.retrieve.complete](detailEditMode, action) {
      return [
        action.editMode,
        ()=>`set detailEditMode from action.editMode ... ${action.editMode}`
      ];
    },

    [AT.detailStudent.changeEditMode](detailEditMode, action) {
      return [
        true,
        ()=>'set detailEditMode to true'
      ];
    },
    
  });
  
  return function detailEditMode(detailEditMode=false, action) {
    return reductionHandler.reduce(detailEditMode, action);
  }

}
