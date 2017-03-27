import {AT}           from '../actions';
import {reducerHash}  from 'astx-redux-util';
import Log            from '../../shared/util/Log';

const log = new Log('appState.userMsg');

export default reducerHash.withLogging(log, {

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

}, []); // initialState
