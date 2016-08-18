'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';
import itemTypes        from '../../shared/model/itemTypes';

// ***
// *** appState.itemsView.itemType.selectedItem reducer (function wrapper)
// ***

// NOTE: This module promotes a reducer function wrapper (with
//       _itemType state), which in turn returns the reducer function.

export default function selectedItem(_itemType) {

  const reductionHandler = new ReductionHandler(`appState.itemsView.${_itemType}.selectedItem`, {

    [AT.selectItem](selectedItem, action) {
      return [
        action.item,
        ()=>`set selectedItem from action.item: ${FMT(action.item)}`
      ];
    },
  
    [AT.itemsView.retrieveComplete] (selectedItem, action) {
      return [
        null,
        ()=>'de-selecting selectedItem on new retrieval'
      ];
    },
  
    [AT.detailStudent.retrieve.complete](selectedItem, action) {
      // TODO: conditional check is a hack ... suspect will be cleaned up if/when we refactor the detail stuff
      if (action.itemType === itemTypes.student) {
        // TODO: seems like this needs to check to see if same studentNum (suspect it works only because editing detail ALWAYS selects it too)
        return [
          action.student,
          ()=>'set selectedItem from action.student ... ' + FMT(action.student)
        ];
      }
    },
  
    [AT.selCrit.delete.complete](selectedItem, action) {
      // sync when our view has been impacted by selCrit deletion
      if (action.impactView===_itemType) {
        return [
          null,
          ()=>'clear selectedItem becase our view is based on deleted selCrit'
        ];
      }
      // no-sync when our view is not impacted by selCrit deletion
      // ?? test ... with enhacement to ReductionHandler, we can OMIT THIS
      else {
        return [
          selectedItem,
          ()=>'no change to selectedItem because our view is NOT based on deleted selCrit'
        ];
      }
    },
  
  });
  
  return function selectedItem(selectedItem=null, action) {
    return reductionHandler.reduce(selectedItem, action);
  }

}
