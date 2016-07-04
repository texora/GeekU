'use strict'

import {AT}            from './actions';
import ReduxSubReducer from '../util/ReduxSubReducer';


// ***
// *** appState.students.selCrit.name reducer
// ***

const subReducer = new ReduxSubReducer('appState.students.selCrit.name', {

  // ??? pattern for later
  // ? [AT.selectStudent](name, action) {
  // ?   return [
  // ?     action.student,
  // ?     ()=>'set name from action.student ... ' + JSON.stringify(action.student, null, 2)
  // ?   ];
  // ? },

});

export default function name(name='', action) {
  return subReducer.resolve(name, action);
}
