'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.students.selCrit reducer
// ***

const reductionHandler = new ReductionHandler('appState.students.selCrit', {

  [AT.retrieveStudents.complete](selCrit, action) {
    const nextSelCrit = action.selCrit;

    // when content is identical, only sync with more current lastDbModDate
    // ... retaining most-current dbHash (from seperate save)
    // ... avoiding race conditions with concurrent:
    //       - selCrit edit save, AND
    //       - retrieveStudents
    const shouldSync = !selCrit                                ||         // selCrit is not yet defined (initialization of view) -or-
                       nextSelCrit.curHash !== selCrit.curHash ||         // NOT identical content -or-
                       nextSelCrit.lastDbModDate > selCrit.lastDbModDate; // IDENTICAL content where nextSelCrit is more current (retaining most-current dbHash [via save])
    if (shouldSync) {
      return [
        nextSelCrit,
        ()=>'set selCrit from action ... ' + FMT(nextSelCrit)
      ];
    }
    else {
      return [
        selCrit,
        ()=>'retaining current selCrit with identical content, preserving more current dbHash from prior save (race condition resolution)'
      ];
    }

  },

  [AT.selCrit.save.complete](selCrit, action) {
    // sync any save that is the same selCrit (via key)
    if (selCrit.key === action.selCrit.key) {
      return [
        action.selCrit,
        ()=>'set selCrit from action ... ' + FMT(action.selCrit)
      ];
    }
    // no-op sync when not the same selCrit (via key)
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
