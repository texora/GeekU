'use strict'

import {AT}      from './actions';
import ReduxUtil from '../util/ReduxUtil';

import Log from '../../shared/util/Log';

const log = new Log('appState.students.arr');

// ***
// *** appState.students.arr reducer
// ***

const reducers = { // our sub-reducers (in lieu of switch statement)
  
  [AT.studentsRetrieved](arr, action) {
    log.debug(()=>'AT.studentsRetrieved(): updating arr: ', action.arr);
    return action.arr;
  },

};

export default function arr(arr=[], action) {
  // console.trace('??? in appState.students.arr reducer, action: ' + action.type);
  return ReduxUtil.resolveReducer(reducers, arr, action)
}
