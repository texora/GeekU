'use strict'

import * as Redux from 'redux';

import activeView, * as fromActiveView from './appState.itemsView.activeView';
import itemType,   * as fromItemType   from './appState.itemsView.itemType';

import itemTypes   from '../../shared/domain/itemTypes';


// ***
// *** appState.itemsView reducer
// ***

// initialize our baseline reducers
const reducers = {
  activeView,
};

// programmatically inject each supported itemType
itemTypes.meta.allTypes.forEach( _itemType => reducers[_itemType] = itemType(_itemType) );

const itemsView = Redux.combineReducers(reducers);

export default itemsView;


//***
//*** Selectors ...
//***

export const getActiveView              = (itemsView)           => fromActiveView .getActiveView              (itemsView.activeView);

export const getItemsViewHoveredItem    = (itemsView, itemType) => fromItemType   .getItemsViewHoveredItem    (itemsView[itemType]);
export const getItemsViewSelectedItem   = (itemsView, itemType) => fromItemType   .getItemsViewSelectedItem   (itemsView[itemType]);
export const getItemsViewDetailItem     = (itemsView, itemType) => fromItemType   .getItemsViewDetailItem     (itemsView[itemType]);
export const getItemsViewDetailEditMode = (itemsView, itemType) => fromItemType   .getItemsViewDetailEditMode (itemsView[itemType]);
export const isItemsViewInProgress      = (itemsView, itemType) => fromItemType   .isItemsViewInProgress      (itemsView[itemType]);
export const getItemsViewSelCrit        = (itemsView, itemType) => fromItemType   .getItemsViewSelCrit        (itemsView[itemType]);
export const getItemsViewItems          = (itemsView, itemType) => fromItemType   .getItemsViewItems          (itemsView[itemType]);

export const isSelCritActiveInView      = (itemsView, selCrit) => {
  // locate the active selCrit (if any) for the supplied selCrit's itemType
  const activeSelCrit = getItemsViewSelCrit(itemsView, selCrit.itemType);

  // determine if the supplied selCrit IS the active one
  const isSuppliedSelCritActive = activeSelCrit && activeSelCrit.key === selCrit.key;
  return isSuppliedSelCritActive;
};
