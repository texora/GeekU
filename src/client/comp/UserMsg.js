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

  class extends React.Component { // component definition

    constructor(props, context) {
      super(props, context);
      autoBindAllMethods(this);
    }

    render() {
      const { open, msg, closeFn } = this.props
      return <Snackbar open={open}
                       message={msg}
                       autoHideDuration={5000}
                       onRequestClose={closeFn}/>;
    }

  }, // end of ... component definition

  { // component property injection
    mapStateToProps(appState, ownProps) {
      return {
        open: appState.userMsg.open,
        msg:  appState.userMsg.msg,
      }
    },
    mapDispatchToProps(dispatch, ownProps) {
      return {
        closeFn: (reason) => { dispatch( AC.closeUserMsg() ) }, // reason can be: 'timeout' or 'clickaway'
      }
    }
  }); // end of ... component property injection

// define expected props
UserMsg.propTypes = {
}

export default UserMsg;
