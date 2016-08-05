'use strict';

import React              from 'react';
import * as ReactRedux    from 'react-redux';
import autobind           from 'autobind-decorator';
import Snackbar           from 'material-ui/lib/snackbar';
import assert             from 'assert';
import {AC}               from '../actions'


/**
 * Utility component to display a User Message (using the Material UI Snackbar).
 */

@ReactRedux.connect( (appState, ownProps) => {
  const open       =  appState.userMsg.length>0;
  const userMsg    =  appState.userMsg[0];
  const msg        =  open ? userMsg.msg : '';
  const userAction =  open ? userMsg.userAction : null;
  const actionTxt  =  userAction ? userAction.txt      : null;
  const actionFn   =  userAction ? userAction.callback : null;
  return {
    open,
    msg,
    actionTxt,
    actionFn,
  };
})

@autobind

export default class UserMsg extends React.Component {

  constructor(props, context) {
    super(props, context);

    // keep track of our one-and-only instance
    assert(!_singleton, "<UserMsg> only ONE UserMsg is needed and therefore may be instantiated within the app.");
    _singleton = this;
  }


  /**
   * Display a user message programmatically.
   *
   * NOTE: An alternate technique to activate a user message is through
   *       the Action Creator AC.userMsg.display(msg, userAction).  This 
   *       may be preferred when:
   *         a) additional actions need to be 'batched' with the user
   *            message, and
   *         b) when you have access to the dispatcher.
   *
   * @param {string} msg the message to display.
   * @param {Obj} userAction an optional structure defining a user click action:
   *                userAction: {  // optional action that can be activated by the user
   *                  txt:      '',
   *                  callback: function(event)
   *                }
   * @public
   */
  static display(msg, userAction) {
    // validate that an <UserMsg> has been instantiated
    assert(_singleton, "UserMsg.display() ... ERROR: NO <UserMsg> has been instantiated within the app.");

    // pass-through to our instance method
    _singleton.display(msg, userAction);
  }


  /**
   * display() - internal instance method that activates the user message.
   */
  display(msg, userAction) {
    const p = this.props;
    p.dispatch( AC.userMsg.display(msg, userAction) );
  }


  handleClose(reason) { // reason can be: 'timeout' or 'clickaway'
    const p = this.props;
    if (reason==='timeout')
      p.dispatch( AC.userMsg.close() );
  }

  render() {
    const p = this.props;
    return <Snackbar open={p.open}
                     message={p.msg}
                     action={p.actionTxt}
                     onActionTouchTap={p.actionFn}
                     autoHideDuration={4000}
                     onRequestClose={this.handleClose}/>;
  }

}

// define expected props
UserMsg.propTypes =  {
}

// keep track of our one-and-only instance
let _singleton = null;

export default UserMsg;
