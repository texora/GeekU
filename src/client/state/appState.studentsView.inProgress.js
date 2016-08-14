'use strict'

import {AT}             from '../actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.studentsView.inProgress reducer
// ***

const reductionHandler = new ReductionHandler('appState.studentsView.inProgress', {
  [AT.selectStudentsView.retrieveStart]    (inProgress, action) { return addIn(inProgress, +1); },
  [AT.selectStudentsView.retrieveComplete] (inProgress, action) { return addIn(inProgress, -1); },
  [AT.selectStudentsView.retrieveFail]     (inProgress, action) { return addIn(inProgress, -1); },
});

function addIn(val, additive) {
  let newVal = val + additive;
  if (newVal < 0)
    newVal = 0; // never let it go negative ... even if we have something out of sync
  return [newVal, ()=>`setting inProgress to: ${newVal}`];
}

export default function inProgress(inProgress=0, action) {
  return reductionHandler.reduce(inProgress, action);
}
