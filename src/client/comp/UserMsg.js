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
    }
  }); // end of ... component property injection

// define expected props
UserMsg.propTypes =  {
}

export default UserMsg;
