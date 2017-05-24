import actions        from '../actions';
import {reducerHash}  from 'astx-redux-util';
import itemTypes      from '../../shared/domain/itemTypes';
import Log            from '../../shared/util/Log';


// ***
// *** appState.itemsView.itemType.items reducer (function wrapper)
// ***

// NOTE: This module promotes a reducer function wrapper (with
//       _itemType state), which in turn returns the reducer function.

export default function items(_itemType) {

  const log = new Log(`appState.itemsView.${_itemType}.items`);

  return reducerHash.withLogging(log, {

    [actions.itemsView.retrieve.complete](items, action) {
      return [
        action.items,
        ()=>`set items from action: ${action.items.length} ${itemTypes.meta[action.itemType].label.plural}`
      ];
    },

    [actions.detailItem.retrieve.complete](items, action) {
      const keyField = itemTypes.meta[action.itemType].keyField;
      return [
        items.map( (item) => {
          return action.item[keyField]===item[keyField] ? action.item : item
        }),
        ()=>`patching detail item into items[] from action.item: ${action.item[keyField]}`
      ];
    },

    [actions.selCrit.delete.complete](items, action) {
      // sync when our view has been impacted by selCrit deletion
      if (action.impactView===_itemType) {
        return [
          [],
          ()=>'clear items ([]) becase our view is based on deleted selCrit'
        ];
      }
      // no-sync when our view is not impacted by selCrit deletion
      else {
        return [
          items,
          ()=>'no change to items because our view is NOT based on deleted selCrit'
        ];
      }
    },

  }, []); // initialState

}


//***
//*** Selectors ...
//***

export const getItemsViewItems = (items) => items;
