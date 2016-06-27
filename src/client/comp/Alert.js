'use strict';

import React              from 'react';
import assert             from 'assert';
import autoBindAllMethods from '../../shared/util/autoBindAllMethods';
import Dialog             from 'material-ui/lib/dialog';


/**
 * An Alert is a thin wrapper around the <Dialog> component that
 * manages the display independent from appState.  The incentive for
 * this component is to provide a means to activate an Alert within a
 * logic flow.
 *
 * Alerts are urgent interruptions that inform the user about a
 * particular situation, requiring user acknowledgment.
 * 
 * The Alert component accepts all the properties of <Dialog>, with
 * the following exceptions:
 *  - actions: are required, because this is the only way to communicate
 *    user intent (and must close the <Alert> because alerts are
 *    modal)
 *  - modal: may NOT be supplied, because alerts are forced to be modal
 *  - onRequestClose: may NOT be supplied, because this is controlled by <Alert>
 *  - open: may NOT be supplied, because this is controlled by <Alert>
 * 
 * Usage:
 *
 *  - Pre-Instantiate all needed Alert(s) (initially hidden) with
 *    appropriate content -AND- actions, retaining a reference to each
 *    Alert instance:
 *
 *        <Alert ref={(alert)=>{this.unsavedChangesAlert=alert}}
 *               title='Foo Edit'
 *               actions={[
 *                 <FlatButton label="Discard Changes"
 *                             primary={true}
 *                             onTouchTap={ () => {
 *                                 this.unsavedChangesAlert.close();
 *                                 this.close(); // close our overall Foo dialog
 *                               }}/>,
 *                 <FlatButton label="Go Back (in order to Save Changes)"
 *                             primary={true}
 *                             onTouchTap={ () => {
 *                                 this.unsavedChangesAlert.close();
 *                               }}/>,
 *               ]}>
 *          You have un-saved changes ... if you leave, your changes will NOT be saved!
 *        </Alert>
 *    
 *  - When needed (in your logic), activate the alert, which forces the user
 *    to take one of the actions.
 *    
 *        this.unsavedChangesAlert.open();
 *    
 */
export default class Alert extends React.Component {

  constructor(...args) {
    super(...args);

    autoBindAllMethods(this);

    // validate supplied properties
    // ... we pass through all supplied props to <Dialog>
    // ... except those that we control ourselves
    const props = args[0];
    assert(props.actions,                    "<Alert> component REQUIRES the 'actions' property, as this is the only way to close the alert (because all alerts are modal).");
    assert(props.modal===undefined,          "<Alert> may NOT contain the 'modal' property, because all alerts are modal.");
    assert(props.onRequestClose===undefined, "<Alert> may NOT contain the 'onRequestClose' property, because this is controlled by <Alert>.");
    assert(props.open===undefined,           "<Alert> may NOT contain the 'open' property, because this is controlled by <Alert>.");

    // define initial state controlling display of our modal dialog
    this.state = { open: false };
  }

  /**
   * Open (i.e. visualize) our modal alert ... a public access point.
   * @public
   */
  open() {
    this.setState({open: true});
  }

  /**
   * Close (i.e. hide) our modal alert ... a public access point.
   * @public
   */
  close() {
    this.setState({open: false});
  }

  render() {
    // NOTE: onRequestClose={this.close} 
    //       ... does NOT appear to be called when actions are invoked,
    //           RATHER the invoker's action MUST call close()
    //       ... so it appears to be unnneeded here
    return <Dialog modal={true}
                   open={this.state.open}
                   onRequestClose={(buttonClicked)=>alert(`WowZee (I can't believe it) the onRequestClose() WAS FIRED ... buttonClicked: ${buttonClicked?'true':'false'}`)} 
                   {...this.props}/>;
  }
}

// define expected props
Alert.propTypes = {
  actions: React.PropTypes.node.isRequired, // Actions are the ONLY way to take down our Alert
}
