'use strict'

import * as Redux from 'redux';

import activeView from './appState.itemsView.activeView';
import itemType   from './appState.itemsView.itemType';
import itemTypes  from '../../shared/model/itemTypes';


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
