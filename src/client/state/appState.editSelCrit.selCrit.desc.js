'use strict'

import {AT}            from './actions';
import ReduxSubReducer from '../util/ReduxSubReducer';


// ***
// *** appState.editSelCrit.selCrit.desc reducer
// ***

const subReducer = new ReduxSubReducer('appState.editSelCrit.selCrit.desc', {

  [AT.selCrit.edit.descChange](desc, action) {
    return [
      action.desc,
      ()=>`set desc from action.desc: ${action.desc}`
    ];
  },

});

export default function desc(desc='', action) {
  return subReducer.resolve(desc, action);
}
