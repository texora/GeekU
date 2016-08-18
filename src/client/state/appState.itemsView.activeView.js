'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.itemsView.activeView reducer
// ***

const reductionHandler = new ReductionHandler('appState.itemsView.activeView', {

  [AT.itemsView.activate](activeView, action) {
    return [
      action.itemType,
      ()=>`set activeView to action.itemType: '${action.itemType}'`
    ];
  },

});

export default function activeView(activeView='', action) {
  return reductionHandler.reduce(activeView, action);
}
