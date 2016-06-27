'use strict'

import {AT}            from './actions';
import ReduxSubReducer from '../util/ReduxSubReducer';


// ***
// *** appState.students.detailEditMode reducer
// ***

const subReducer = new ReduxSubReducer('appState.students.detailEditMode', {

  [AT.detailStudent.retrieve.complete](detailEditMode, action) {
    return [
      action.editMode,
      ()=>`set detailEditMode from action.editMode ... ${action.editMode}`
    ];
  },

  [AT.detailStudent.changeEditMode](detailEditMode, action) {
    return [
      true,
      ()=>'set detailEditMode to true'
    ];
  },

});

export default function detailEditMode(detailEditMode=false, action) {
  return subReducer.resolve(detailEditMode, action);
}
