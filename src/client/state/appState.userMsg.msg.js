'use strict'

import {AT}            from './actions';
import ReduxSubReducer from '../util/ReduxSubReducer';


// ***
// *** appState.userMsg.msg reducer
// ***

const subReducer = new ReduxSubReducer('appState.userMsg.msg', {

  [AT.userMsg.display](msg, action) {
    return [
      action.msg,
      ()=>`set msg from action: '${action.msg}'`
    ];
  },

});

export default function msg(msg='', action) {
  return subReducer.resolve(msg, action);
}
