'use strict'

import {AT}            from './actions';
import ReduxSubReducer from '../util/ReduxSubReducer';


// ***
// *** appState.students.inProgress reducer
// ***

const subReducer = new ReduxSubReducer('appState.students.inProgress', {
  [AT.retrieveStudents.start]    (inProgress, action) { return [inProgress+1, ()=>`setting inProgress to: ${inProgress+1}`]; },
  [AT.retrieveStudents.complete] (inProgress, action) { return [inProgress-1, ()=>`setting inProgress to: ${inProgress-1}`]; },
  [AT.retrieveStudents.fail]     (inProgress, action) { return [inProgress-1, ()=>`setting inProgress to: ${inProgress-1}`]; },
});

export default function inProgress(inProgress=0, action) {
  return subReducer.resolve(inProgress, action);
}
