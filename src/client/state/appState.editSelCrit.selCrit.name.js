'use strict'

import {AT}            from './actions';
import ReduxSubReducer from '../util/ReduxSubReducer';


// ***
// *** appState.editSelCrit.selCrit.name reducer
// ***

const subReducer = new ReduxSubReducer('appState.editSelCrit.selCrit.name', {

  [AT.selCrit.edit.nameChange](name, action) {
    return [
      action.name,
      ()=>`set name from action.name: ${action.name}`
    ];
  },

});

export default function name(name='', action) {
  return subReducer.resolve(name, action);
}
