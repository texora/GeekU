'use strict'

import {AT, AC}  from './actions';
import ReduxUtil from '../util/ReduxUtil';

import Log from '../../shared/util/Log';

const log = new Log('appState.students.selCrit');

// ***
// *** appState.students.selCrit reducer
// ***

const reducers = { // our sub-reducers (in lieu of switch statement)

  // ??? NO - NOW accomplished by async actions
  // ? [AT.retrieveStudents](selCrit, action) {
  // ? 
  // ?   // async retrieval of students
  // ?   log.info(()=>'AT.retrieveStudents(): initiating retrieval using selCrit: ', action.selCrit); // ?? debug
  // ?   // ... ??? interpret action.selCrit
  // ?   geekUFetch('/api/students') // all Students (return default fields)
  // ?      .then( res => {
  // ?        log.info(()=>'AT.retrieveStudents(): successful retrieval ... res: ', res); // ?? debug
  // ?        // ??? need dispatcher
  // ?        AC.studentsRetrieved(action.selCrit, res.payload);
  // ?      })
  // ?      .catch( err => {
  // ?        log.error(()=>'AT.retrieveStudents: err: ', err);
  // ?      });
  // ? 
  // ?   return selCrit; // no update yet (till we get results
  // ? },
  
  [AT.studentsRetrieved](selCrit, action) {
    log.info(()=>'AT.studentsRetrieved(): updating selCrit: ', action.selCrit); // ?? debug
    return action.selCrit;
  },

};

export default function selCrit(selCrit={}, action) {
  // console.trace('??? in appState.students.selCrit reducer, action: ' + action.type);
  return ReduxUtil.resolveReducer(reducers, selCrit, action)
}
