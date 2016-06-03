'use strict'

import {AT}            from './actions';
import ReduxSubReducer from '../util/ReduxSubReducer';


// ***
// *** appState.userMsg.open reducer
// ***

const subReducer = new ReduxSubReducer('appState.userMsg.open', {

  [AT.userMsg.display](open, action) {
    return [
      true,
      ()=>'set open: true'
    ];
  },

  [AT.userMsg.close](open, action) {
    return [
      false,
      ()=>'set open: false'
    ];
  },

});

export default function open(open=false, action) {
  return subReducer.resolve(open, action);
}
