'use strict';

import createNamedLogic, * as LOGIC  from './util/createNamedLogic';
import {AT}       from '../actions';
import selectors  from '../state';


/**
 * Debounce (i.e. scale back) hoverItem action occurrences.
 */
export default createNamedLogic('debounceHoverItem', {

  type:     AT.hoverItem.valueOf(),
  debounce: 100,  // ms
  latest:   true, // take latest only

  // optimize by no-oping when hoveredItem has NOT changed from current state
  validate({getState, action, log}, allow, reject) {

    const appState       = getState();
    const curHoveredItem = selectors.getItemsViewHoveredItem(appState, action.itemType);

    // Logging Note: We bypass logging of hover actions because they are just too prolific (filling up our logs)
    if (curHoveredItem === action.item) {
      // log.debug(()=> `OPTIMIZATION: rejecting action: ${FMT(action.type)} because hoveredItem is same as current state`);
      reject();
    }
    else {
      // log.debug(()=> `permitting action: ${FMT(action.type)} because hoveredItem has changed`);
      allow( action );
    }
  },


});
