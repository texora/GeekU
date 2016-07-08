'use strict'

import {AT}            from './actions';
import ReduxSubReducer from '../util/ReduxSubReducer';


// ***
// *** appState.students.selCrit.sort reducer
// ***

const subReducer = new ReduxSubReducer('appState.students.selCrit.sort', {

  [AT.editStudentsSelCrit.sortChange](sort, action) {
    return [
      action.sort,
      ()=>`set sort to action.sort: ${action.sort ? JSON.stringify(action.sort, null, 2) : 'null'}`
    ];
  },

});

export default function sort(sort=null, action) {
  return subReducer.resolve(sort, action);
}
