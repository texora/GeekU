import {AT}           from '../actions';
import {reducerHash}  from 'astx-redux-util';
import Log            from '../../shared/util/Log';

// ***
// *** appState.itemsView.itemType.detailEditMode reducer (function wrapper)
// ***

// NOTE: This module promotes a reducer function wrapper (with
//       _itemType state), which in turn returns the reducer function.

export default function detailEditMode(_itemType) {

  const log = new Log(`appState.itemsView.${_itemType}.detailEditMode`);

  return reducerHash.withLogging(log, {

    [AT.detailItem.retrieve.complete]: (detailEditMode, action) => [
      action.editMode,
      ()=>`set detailEditMode from action.editMode ... ${action.editMode}`
    ],

    [AT.detailItem.change.detailEditMode]: (detailEditMode, action) => [
      true,
      ()=>'set detailEditMode to true'
    ],

  }, false); // initialState

}

//***
//*** Selectors ...
//***

export const getItemsViewDetailEditMode = (detailEditMode) => detailEditMode;
