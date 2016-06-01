'use strict'

import * as Redux from 'redux';

import open from './appState.userMsg.open';
import msg  from './appState.userMsg.msg';

// ***
// *** appState.userMsg reducer
// ***

const userMsg = Redux.combineReducers({
  open,
  msg,
});
export default userMsg;
