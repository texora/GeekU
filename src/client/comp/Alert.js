'use strict';

import React              from 'react';
import assert             from 'assert';
import autoBindAllMethods from '../../shared/util/autoBindAllMethods';
import Dialog             from 'material-ui/lib/dialog';
import FlatButton         from 'material-ui/lib/flat-button';


/**
 * The Alert utility provides a programmatic means by which user
 * alerts and confirmations may be obtained through a modal dialog.
 *
 * Alerts are urgent interruptions that inform the user about a
 * particular situation, requiring user acknowledgment.
 * 
 * Alerts may be created with a simple user 'OK' confirmation, or any
 * number of client-specific actions (via a functional callback per action).
 * 
 * Usage:
 *
 *  - Pre-Instantiate one Alert (initially hidden) somewhere at the top-level of your app.
 *
 *        <Alert/>
 *    
 *  - When needed (anywhere in your logic), activate the alert, forcing the user
 *    to acknowledge one of the actions.
 *    
 *        Alert.display({
 *          title: 'Student Edit',
 *          msg:   'You have un-saved changes ... if you leave, your changes will NOT be saved!',
 *          actions: [
 *            { txt: 'Discard Changes', action: () => ...callback-logic-here... },
 *            { txt: 'Go Back',         action: () => ...callback-logic-here... }
 *          ]
 *        });
 *    
 */
export default class Alert extends React.Component {

  constructor(...args) {
    super(...args);

    autoBindAllMethods(this);

    // keep track of our one-and-only instance
    assert(!_singleton, "<Alert> only ONE Alert is needed and therefore may be instantiated within the app.");
    _singleton = this;

    // define initial state controlling display of our modal dialog
    this.state = { open: false };

    // we maintain an array of directives, supporting multiple concurrent alerts
    this.directives = [];
  }

  /**
   * Display our modal alert ... a public access point.
   *
   * @param {Object} directive the directive containing message/actions/title.
   *   {
   *     title: 'bla',  // the OPTIONAL Alert title
   *     msg:   'bla',  // the primary message to display (can be string or dom elm)
   *     actions: [     // the OPTIONAL user actions to invoke [DEFAULT: simple OK button]
   *       { txt 'bla' [, action: function()] },
   *       { txt 'bla' [, action: function()] },
   *     ]
   *   }
   *
   * @public
   */
  static display(directive) {
    // validate that an <Alert> has been instantiated
    assert(_singleton, "Alert.display() ... ERROR: NO <Alert> has been instantiated within the app.");

    // pass-through to our instance method
    _singleton.display(directive);
  }

  display(directive) {
    // validate the directive parameter
    assert(directive,     '<Alert.display() missing the directive parameter');
    assert(directive.msg, `<Alert.display() missing the directive.msg attribute for directive: ${JSON.stringify(directive, null, 2)}`);

    // maintain our state as OPEN
    this.directives.push(directive);                   // ... retain the directive to display
    this.setState({open: this.directives.length > 0}); // ... utilize react state to refresh display
  }

  close() {
    // maintain our state as CLOSED (or display prior directive)
    this.directives.pop();
    this.setState({open: this.directives.length > 0});
  }

  currentDirective() {
    const  indx = this.directives.length - 1;
    return indx >= 0 ? this.directives[indx] : null;
  }

  render() {
    // no-op when NO alerts are active
    if (!this.state.open)
      return null;

    const directive = this.currentDirective();

    // morph supplied actions in to a series of buttons used in our dialog
    const actions = directive.actions || [{txt: 'OK'}]; // when NO actions are supplied, merely use an Alert Dialog
    const dialogActions = actions.map( (action) => {
      return <FlatButton label={action.txt}
                         primary={true}
                         onTouchTap={ () => {
                             this.close();       // always close self
                             if (action.action)  // invoke client-function (when supplied)
                               action.action();
                           }}/>;
    });

    return <Dialog modal={true}
                   open={true}
                   title={directive.title}
                   actions={dialogActions}
                   children={directive.msg}/>;
  }
}

// define expected props
Alert.propTypes = {
}

// keep track of our one-and-only instance
let _singleton = null;
