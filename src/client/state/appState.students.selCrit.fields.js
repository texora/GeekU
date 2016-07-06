'use strict'

import {AT}            from './actions';
import ReduxSubReducer from '../util/ReduxSubReducer';


// ***
// *** appState.students.selCrit.fields reducer
// ***

const subReducer = new ReduxSubReducer('appState.students.selCrit.fields', {

  [AT.editStudentsSelCrit.fieldsChange](fields, action) {
    console.log('??? action.fields: ', action.fields);
    return [
      action.fields,
      ()=>`set fields to action.fields: ${action.fields ? action.fields.toString() : 'null'}`
    ];
  },

});

export default function fields(fields=null, action) {
  return subReducer.resolve(fields, action);
}
