import actions        from '../actions';
import {reducerHash}  from 'astx-redux-util';
import Log            from '../../shared/util/Log';

// ***
// *** appState.itemsView.itemType.selCrit reducer (function wrapper)
// ***

// NOTE: This module promotes a reducer function wrapper (with
//       _itemType state), which in turn returns the reducer function.

export default function selCrit(_itemType) {

  const log = new Log(`appState.itemsView.${_itemType}.selCrit`);

  return reducerHash.withLogging(log, {

    [actions.itemsView.retrieve.complete](selCrit, action) {
      return [
        action.selCrit,
        ()=>`set selCrit from action ... ${FMT(action.selCrit)}`
      ];
    },

    [actions.selCrit.delete.complete](selCrit, action) {
      // sync when our view has been impacted by selCrit deletion
      if (action.impactView===_itemType) {
        return [
          null,
          ()=>'clear selCrit becase our view is based on deleted selCrit'
        ];
      }
      // no-sync when our view is not impacted by selCrit deletion
      else {
        return [
          selCrit,
          ()=>'no change to selCrit because our view is NOT based on deleted selCrit'
        ];
      }
    },

  }, null); // initialState

}


//***
//*** Selectors ...
//***

export const getItemsViewSelCrit = (selCrit) => selCrit || {name: 'please', desc: 'select a filter from the Left Nav menu'};
