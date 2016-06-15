'use strict'

import {AT}            from './actions';
import ReduxSubReducer from '../util/ReduxSubReducer';


// ***
// *** appState.userMsg reducer
// ***

const subReducer = new ReduxSubReducer('appState.userMsg', {

  [AT.userMsg.display](userMsg, action) {
    return [
      [...userMsg, {msg: action.msg, userAction: action.userAction}], // add new msg to end of queue
      ()=>`set msg from action: '${action.msg}'`
    ];
  },

  [AT.userMsg.close](userMsg, action) {
    return userMsg.length === 0 
             ? userMsg
             : [
                 [...userMsg.slice(1)], // remove first element (of queue)
                 ()=>`removing current msg: '${userMsg[0].msg}'`
               ];
  },

});

export default function userMsg(userMsg=[], action) {
  return subReducer.resolve(userMsg, action);
}
