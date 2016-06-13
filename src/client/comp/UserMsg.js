'use strict';

import React              from 'react';
import ReduxUtil          from '../util/ReduxUtil';
import autoBindAllMethods from '../../shared/util/autoBindAllMethods';
import Snackbar           from 'material-ui/lib/snackbar';
import {AC}               from '../state/actions'

/**
 * Utility component to display a User Message (using the Material UI Snackbar).
 */
const UserMsg = ReduxUtil.wrapCompWithInjectedProps(

  class UserMsg extends React.Component { // component definition

    constructor(props, context) {
      super(props, context);
      autoBindAllMethods(this);
    }

    render() {
      const { open, msg, actionTxt, actionFn, closeFn } = this.props
      return <Snackbar open={open}
                       message={msg}
                       action={actionTxt}
                       onActionTouchTap={actionFn}
                       autoHideDuration={4000}
                       onRequestClose={closeFn}/>;
    }

  }, // end of ... component definition

  { // component property injection
    mapStateToProps(appState, ownProps) {
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
      }
    },
    mapDispatchToProps(dispatch, ownProps) {
      return {
        closeFn: (reason) => { if (reason==='timeout') dispatch( AC.userMsg.close() ) }, // reason can be: 'timeout' or 'clickaway'
      }
    }
  }); // end of ... component property injection

// define expected props
UserMsg.propTypes =  {
  open:       React.PropTypes.bool,    // .isRequired - injected via self's wrapper
  msg:        React.PropTypes.string,  // .isRequired - injected via self's wrapper
  actionTxt:  React.PropTypes.string,  //               injected via self's wrapper
  actionFn:   React.PropTypes.func,    //               injected via self's wrapper
  closeFn:    React.PropTypes.func     // .isRequired - injected via self's wrapper
}

export default UserMsg;
