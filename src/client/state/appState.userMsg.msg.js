'use strict'

import {AT}      from './actions';
import ReduxUtil from '../util/ReduxUtil';

import Log from '../../shared/util/Log';

const log = new Log('appState.userMsg.msg');

// ***
// *** appState.userMsg.msg reducer
// ***

const reducers = { // our sub-reducers (in lieu of switch statement)
  
  [AT.displayUserMsg](msg, action) {
    log.info(()=>`AT.displayUserMsg(): updating msg: '${action.msg}'`); // ?? debug
    return action.msg;
  },

};

export default function msg(msg='', action) {
  return ReduxUtil.resolveReducer(reducers, msg, action)
}
