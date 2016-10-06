'use strict'

import * as Redux from 'redux';

import userMsg      from './appState.userMsg';
import itemsView,   * as fromItemsView   from './appState.itemsView';
import filters,     * as fromFilters     from './appState.filters';
import editSelCrit, * as fromEditSelCrit from './appState.editSelCrit';

// ***
// *** our app's top-level reducer
// ***

const appState = Redux.combineReducers({
  userMsg,
  itemsView,
  filters,
  editSelCrit,
});
export default appState;


//***
//*** Selectors ...
//***

export const getActiveView              = (appState)           => fromItemsView.getActiveView              (appState.itemsView);

export const getItemsViewHoveredItem    = (appState, itemType) => fromItemsView.getItemsViewHoveredItem    (appState.itemsView, itemType);
export const getItemsViewSelectedItem   = (appState, itemType) => fromItemsView.getItemsViewSelectedItem   (appState.itemsView, itemType);
export const getItemsViewDetailItem     = (appState, itemType) => fromItemsView.getItemsViewDetailItem     (appState.itemsView, itemType);
export const getItemsViewDetailEditMode = (appState, itemType) => fromItemsView.getItemsViewDetailEditMode (appState.itemsView, itemType);
export const isItemsViewInProgress      = (appState, itemType) => fromItemsView.isItemsViewInProgress      (appState.itemsView, itemType);
export const getItemsViewSelCrit        = (appState, itemType) => fromItemsView.getItemsViewSelCrit        (appState.itemsView, itemType);
export const getItemsViewItems          = (appState, itemType) => fromItemsView.getItemsViewItems          (appState.itemsView, itemType);
export const isSelCritActiveInView      = (appState, selCrit)  => fromItemsView.isSelCritActiveInView      (appState.itemsView, selCrit);

export const getFilters                 = (appState)           => fromFilters.getFilters                   (appState.filters);

export const getEditSelCrit             = (appState)           => fromEditSelCrit.getEditSelCrit           (appState.editSelCrit);

export const getActiveUserMsg           = (appState)           => appState.userMsg.length>0 ? appState.userMsg[0] : null;
