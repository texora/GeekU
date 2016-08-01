'use strict'

import {AT}   from '../actions';
import assert from 'assert';

/**
 * AC.userMsg.display(msg, userAction): an action creator that
 * displays a user message.
 *
 * NOTE: An alternate technique to activate a user message is through
 *       the static UserMsg.display(msg [, userAction]) method.  This
 *       may be preferred when:
 *         a) no other actions need to be 'batched' with the user
 *            message, and/or
 *         b) when you have NO access to the dispatcher.
 *
 * @param {string} msg the message to display.
 * @param {Obj} userAction an optional structure defining a user click action:
 *                userAction: {  // optional action that can be activated by the user
 *                  txt:      '',
 *                  callback: function(event)
 *                }
 */
export default function userMsgDisplayAC(msg, userAction) {

  // validate params
  const errPrefix = () => {
    const userActionStr = userAction ? `, ${JSON.stringify(userAction)}` : '';
    return `ERROR: Action Creator AC.userMsg.display('${msg}'${userActionStr}) ...`;
  };
  assert(typeof msg === 'string', `${errPrefix()} requires a msg string param`);
  if (userAction) { // optional
    assert(typeof userAction.txt      === 'string',   `${errPrefix()} userAction param requires a .txt string property`);
    assert(typeof userAction.callback === 'function', `${errPrefix()} userAction param requires a .callback function property`);
  }

  // create our action
  return {
    type: AT.userMsg.display,
    msg,
    userAction
  };
  
}
