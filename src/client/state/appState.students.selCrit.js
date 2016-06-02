'use strict'

import {AT}      from './actions';
import ReduxUtil from '../util/ReduxUtil';

import Log from '../../shared/util/Log';

const log = new Log('appState.students.selCrit');

// ***
// *** appState.students.selCrit reducer
// ***

const reducers = { // our sub-reducers (in lieu of switch statement)
  
  [AT.retrieveStudents.complete](selCrit, action) {
    log.info(()=>'AT.retrieveStudents.complete: updating selCrit: ', action.selCrit); // ?? debug
    return action.selCrit;
  },

};

export default function selCrit(selCrit={}, action) {
  return ReduxUtil.resolveReducer(reducers, selCrit, action)
}
