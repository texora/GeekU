'use strict'

import {AT}             from './actions';
import ReductionHandler from '../util/ReductionHandler';


// ***
// *** appState.students.detailEditMode reducer
// ***

const reductionHandler = new ReductionHandler('appState.students.detailEditMode', {

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
  return reductionHandler.reduce(detailEditMode, action);
}
