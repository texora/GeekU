'use strict'

import {AT}            from './actions';
import ReduxSubReducer from '../util/ReduxSubReducer';


// ***
// *** appState.students.items reducer
// ***

const subReducer = new ReduxSubReducer('appState.students.items', {

  [AT.retrieveStudents.complete](items, action) {
    return [
      action.items,
      ()=>`set items from action: ${action.items.length} students`
    ];
  },

});

export default function items(items=[], action) {
  return subReducer.resolve(items, action);
}
