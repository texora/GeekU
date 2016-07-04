'use strict'

import {AT}            from './actions';
import ReduxSubReducer from '../util/ReduxSubReducer';


// ***
// *** appState.students.selCrit.editing reducer
// ***

const subReducer = new ReduxSubReducer('appState.students.selCrit.editing', {

  [AT.editStudentsSelCrit](editing, action) {
    return [
      true,
      ()=>'set editing to true'
    ];
  },

  [AT.editStudentsSelCrit.close](editing, action) {
    return [
      false,
      ()=>'set editing to false'
    ];
  },

});

export default function editing(editing=false, action) {
  return subReducer.resolve(editing, action);
}
