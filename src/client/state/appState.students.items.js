'use strict'

import {AT}      from './actions';
import ReduxUtil from '../util/ReduxUtil';

import Log from '../../shared/util/Log';

const reducerName = 'appState.students.items';
const log         = new Log(reducerName);

// ***
// *** appState.students.items reducer
// ***

const reducers = { // our sub-reducers (in lieu of switch statement)
  
  [AT['retrieveStudents.complete']](items, action) {
    log.debug(()=>`in sub-reducer ${reducerName}, action: '${action.type}' ... replacing items with ${action.items.length} students`);
    return action.items;
  },

};

export default function items(items=[], action) {
  log.debug(()=>`in reducer: ${reducerName}, action: '${action.type}'`);
  return ReduxUtil.resolveReducer(reducers, items, action)
}
