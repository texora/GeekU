'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.studentsView.selCrit reducer
// ***

const reductionHandler = new ReductionHandler('appState.studentsView.selCrit', {

  [AT.selectStudentsView.retrieveComplete](selCrit, action) {
    return [
      action.selCrit,
      ()=>`set selCrit from action ... ${FMT(action.selCrit)}`
    ];
  },

  [AT.selCrit.delete.complete](selCrit, action) {
    // sync when our view has been impacted by selCrit deletion
    if (action.impactView==='Students') {
      return [
        null,
        ()=>'clear selCrit becase our view is based on deleted selCrit'
      ];
    }
    // no-sync when our view is not impacted by selCrit deletion
    else {
      return [
        selCrit,
        ()=>'no change to selCrit'
      ];
    }
  },


});

export default function selCrit(selCrit=null, action) {
  return reductionHandler.reduce(selCrit, action);
}
