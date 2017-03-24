import {AT}           from '../actions';
import {reducerHash}  from 'astx-redux-util';
import Log            from '../../shared/util/Log';

// ***
// *** appState.itemsView.itemType.detailItem reducer (function wrapper)
// ***

// NOTE: This module promotes a reducer function wrapper (with
//       _itemType state), which in turn returns the reducer function.

export default function detailItem(_itemType) {

  const log = new Log(`appState.itemsView.${_itemType}.detailItem`);

  return reducerHash.withLogging(log, {

    [AT.detailItem.retrieve.complete]: (detailItem, action) => [
        action.item,
        ()=>'set detailItem from action.item ... ' + FMT(action.item)
    ],

    [AT.detailItem.close]: (detailItem, action) => [
        null,
        ()=>'clearing detailItem'
    ],

  }, null); // initialState

}


//***
//*** Selectors ...
//***

export const getItemsViewDetailItem = (detailItem) => detailItem;
