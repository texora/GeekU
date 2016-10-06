'use strict'

import * as Redux from 'redux';

import hoveredItem,    * as fromHoveredItem    from './appState.itemsView.itemType.hoveredItem';
import selectedItem,   * as fromSelectedItem    from './appState.itemsView.itemType.selectedItem';
import detailItem,     * as fromDetailedItem    from './appState.itemsView.itemType.detailItem';
import detailEditMode, * as fromDetailEditMode  from './appState.itemsView.itemType.detailEditMode';
import inProgress,     * as fromInProgress      from './appState.itemsView.itemType.inProgress';
import selCrit,        * as fromSelCrit         from './appState.itemsView.itemType.selCrit';
import items,          * as fromItems           from './appState.itemsView.itemType.items';

// ***
// *** appState.itemsView.itemType reducer (function wrapper)
// ***

// NOTE: This module promotes a reducer function wrapper (with
//       _itemType state), which in turn returns the reducer function.

export default function itemType(_itemType) {

  const combineReducers = Redux.combineReducers({

    hoveredItem:    hoveredItem(_itemType),
    selectedItem:   selectedItem(_itemType),

    detailItem:     detailItem(_itemType),
    detailEditMode: detailEditMode(_itemType),

    inProgress:     inProgress(_itemType),
    selCrit:        selCrit(_itemType),
    items:          items(_itemType),

  });

  return function itemType(itemType={}, action) {

    // NOTE: Our itemType reducers are used in multiple branches of our state tree.
    //       - In support of this, we must instantiate our reducer functions with state (_itemType).
    //       - These itemType reducers should ONLY respond to actions that contain a consistent itemType!
    //         * This is accomplished through the conditional logic (below)
    //         * This short-circuits the process early-on, so we don't have to 
    //           repeatedly check in each of our subordinate reducers!
    return (!action.itemType || action.itemType === _itemType)
             ? combineReducers(itemType, action)
             : itemType;
  }

}


//***
//*** Selectors ...
//***

export const getItemsViewHoveredItem    = (itemType) => fromHoveredItem    .getItemsViewHoveredItem    (itemType.hoveredItem);
export const getItemsViewSelectedItem   = (itemType) => fromSelectedItem   .getItemsViewSelectedItem   (itemType.selectedItem);
export const getItemsViewDetailItem     = (itemType) => fromDetailedItem   .getItemsViewDetailItem     (itemType.detailItem);
export const getItemsViewDetailEditMode = (itemType) => fromDetailEditMode .getItemsViewDetailEditMode (itemType.detailEditMode);
export const isItemsViewInProgress      = (itemType) => fromInProgress     .isItemsViewInProgress      (itemType.inProgress);
export const getItemsViewSelCrit        = (itemType) => fromSelCrit        .getItemsViewSelCrit        (itemType.selCrit);
export const getItemsViewItems          = (itemType) => fromItems          .getItemsViewItems          (itemType.items);
